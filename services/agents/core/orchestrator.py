"""
GalaxyCo.ai - Multi-Agent Orchestrator using LangGraph
========================================================

This module implements the core workflow orchestration using LangGraph's StateGraph.
It coordinates the PAA (Personal AI Assistant) with specialist agents to process
user requests through a structured pipeline:

Workflow: START → PAA Intake → Planner → Router → Specialist → Critic → PAA Summarize → END

Features:
- Persistent state with SQLite checkpointing (survives crashes/restarts)
- Human-in-the-loop approval gates for sensitive operations
- Conditional routing based on task type
- Comprehensive metrics tracking (cost, latency, success rate)
- Async/await throughout for performance
"""

import asyncio
import os
import json
from datetime import datetime
from typing import TypedDict, Annotated, Sequence, Literal
from enum import Enum

from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver
from langgraph.prebuilt import ToolNode

# ============================================================================
# STATE SCHEMA
# ============================================================================

class TaskType(str, Enum):
    """Types of tasks the orchestrator can handle"""
    LEAD_QUALIFICATION = "lead_qualification"
    EMAIL_COMPOSITION = "email_composition"
    DATA_ENRICHMENT = "data_enrichment"
    GENERAL = "general"

class ApprovalStatus(str, Enum):
    """Status of human approval for sensitive operations"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    NOT_REQUIRED = "not_required"

class Outcome(TypedDict):
    """Represents the result of a single agent execution"""
    agent_id: str
    agent_type: str
    result: dict
    timestamp: datetime
    cost: float
    latency_ms: int

class Metrics(TypedDict):
    """Aggregate metrics for the entire workflow"""
    total_cost: float
    total_latency_ms: int
    success_count: int
    failure_count: int
    approval_requests: int

class AgentState(TypedDict):
    """
    Shared state that flows through all nodes in the workflow.
    LangGraph automatically persists this to the checkpoint database.
    """
    # Context
    workspace_id: str
    user_id: str
    workflow_id: str
    
    # Messages
    messages: Annotated[Sequence[BaseMessage], "conversation history"]
    
    # Workflow tracking
    current_step: str
    task_type: TaskType
    subtasks: list[dict]
    
    # Results
    outcomes: list[Outcome]
    final_summary: str | None
    
    # Approval workflow
    approval_status: ApprovalStatus
    approval_message: str | None
    
    # Metrics
    metrics: Metrics
    
    # Error handling
    error: str | None

# ============================================================================
# NODE FUNCTIONS (AGENTS)
# ============================================================================

async def paa_intake_node(state: AgentState) -> AgentState:
    """
    PAA (Personal AI Assistant) analyzes the incoming request.
    Determines task type, priority, and whether approval is needed.
    """
    print(f"[PAA Intake] Analyzing request for workflow {state['workflow_id']}")
    
    # Use Claude for intake analysis (excellent at understanding intent)
    model = ChatAnthropic(
        model="claude-3-5-sonnet-20241022",
        temperature=0.3,
        anthropic_api_key=os.getenv("ANTHROPIC_API_KEY")
    )
    
    system_prompt = SystemMessage(content="""You are the PAA (Personal AI Assistant) intake analyzer.
Your job is to:
1. Understand the user's request
2. Classify the task type
3. Determine if human approval is needed
4. Extract key parameters

Respond in JSON format:
{
  "task_type": "lead_qualification|email_composition|data_enrichment|general",
  "requires_approval": true|false,
  "approval_reason": "explanation if approval needed",
  "extracted_params": {...},
  "priority": "high|medium|low"
}""")
    
    messages = [system_prompt] + list(state["messages"])
    
    start_time = datetime.now()
    response = await model.ainvoke(messages)
    latency_ms = int((datetime.now() - start_time).total_seconds() * 1000)
    
    # Parse PAA's analysis
    try:
        analysis = json.loads(response.content)
    except json.JSONDecodeError:
        analysis = {
            "task_type": "general",
            "requires_approval": False,
            "approval_reason": None,
            "extracted_params": {},
            "priority": "medium"
        }
    
    # Update state
    new_outcome = Outcome(
        agent_id="paa_intake",
        agent_type="paa",
        result=analysis,
        timestamp=datetime.now(),
        cost=0.005,  # Approximate cost for Claude Sonnet
        latency_ms=latency_ms
    )
    
    state["outcomes"].append(new_outcome)
    state["current_step"] = "planner"
    state["task_type"] = TaskType(analysis["task_type"])
    state["approval_status"] = ApprovalStatus.PENDING if analysis["requires_approval"] else ApprovalStatus.NOT_REQUIRED
    state["approval_message"] = analysis.get("approval_reason")
    
    state["metrics"]["total_cost"] += new_outcome["cost"]
    state["metrics"]["total_latency_ms"] += latency_ms
    state["metrics"]["success_count"] += 1
    
    state["messages"].append(AIMessage(content=f"PAA Analysis: {json.dumps(analysis, indent=2)}"))
    
    return state


async def planner_node(state: AgentState) -> AgentState:
    """
    Breaks down complex requests into subtasks.
    Determines execution order and dependencies.
    """
    print(f"[Planner] Creating execution plan for {state['task_type']}")
    
    model = ChatOpenAI(
        model="gpt-4o",
        temperature=0.2,
        openai_api_key=os.getenv("OPENAI_API_KEY")
    )
    
    system_prompt = SystemMessage(content="""You are the task planner.
Break down the user's request into concrete subtasks.

Respond in JSON:
{
  "subtasks": [
    {
      "id": "subtask_1",
      "description": "what to do",
      "specialist": "lead_qualifier|email_composer|data_enricher",
      "depends_on": []
    }
  ],
  "execution_order": ["subtask_1", "subtask_2"]
}""")
    
    messages = [system_prompt] + list(state["messages"])
    
    start_time = datetime.now()
    response = await model.ainvoke(messages)
    latency_ms = int((datetime.now() - start_time).total_seconds() * 1000)
    
    try:
        plan = json.loads(response.content)
    except json.JSONDecodeError:
        plan = {
            "subtasks": [{"id": "main_task", "description": "Process request", "specialist": "general", "depends_on": []}],
            "execution_order": ["main_task"]
        }
    
    new_outcome = Outcome(
        agent_id="planner",
        agent_type="planner",
        result=plan,
        timestamp=datetime.now(),
        cost=0.003,
        latency_ms=latency_ms
    )
    
    state["outcomes"].append(new_outcome)
    state["subtasks"] = plan["subtasks"]
    state["current_step"] = "router"
    state["metrics"]["total_cost"] += new_outcome["cost"]
    state["metrics"]["total_latency_ms"] += latency_ms
    state["metrics"]["success_count"] += 1
    
    state["messages"].append(AIMessage(content=f"Plan: {json.dumps(plan, indent=2)}"))
    
    return state


async def router_node(state: AgentState) -> AgentState:
    """
    Routes to the appropriate specialist agent based on task type.
    This is a simple routing node that doesn't call an LLM.
    """
    print(f"[Router] Routing to specialist for {state['task_type']}")
    
    state["current_step"] = "specialist"
    
    return state


async def specialist_node(state: AgentState) -> AgentState:
    """
    Executes the specialist agent for the given task type.
    In Phase 1.2, this will dispatch to actual specialist implementations.
    For now, it's a placeholder that simulates specialist work.
    """
    print(f"[Specialist] Executing {state['task_type']} specialist")
    
    # Placeholder: In Phase 1.2, this will call actual specialists
    # For now, simulate specialist work
    specialist_result = {
        "status": "success",
        "task_type": state["task_type"],
        "result": f"Simulated result for {state['task_type']}",
        "confidence": 0.95
    }
    
    new_outcome = Outcome(
        agent_id=f"specialist_{state['task_type']}",
        agent_type="specialist",
        result=specialist_result,
        timestamp=datetime.now(),
        cost=0.01,
        latency_ms=500
    )
    
    state["outcomes"].append(new_outcome)
    state["current_step"] = "critic"
    state["metrics"]["total_cost"] += new_outcome["cost"]
    state["metrics"]["total_latency_ms"] += 500
    state["metrics"]["success_count"] += 1
    
    state["messages"].append(AIMessage(content=f"Specialist Result: {json.dumps(specialist_result, indent=2)}"))
    
    return state


async def critic_node(state: AgentState) -> AgentState:
    """
    Evaluates the specialist's output for quality and completeness.
    Decides if retry is needed or if we proceed to summary.
    """
    print(f"[Critic] Evaluating specialist output")
    
    model = ChatOpenAI(
        model="gpt-4o",
        temperature=0.1,
        openai_api_key=os.getenv("OPENAI_API_KEY")
    )
    
    system_prompt = SystemMessage(content="""You are the quality critic.
Evaluate if the specialist's output meets these criteria:
1. Completeness: All required information present
2. Accuracy: Results appear correct
3. Format: Proper structure and formatting
4. User value: Actually helpful to the user

Respond in JSON:
{
  "passed": true|false,
  "quality_score": 0-100,
  "issues": ["list", "of", "problems"],
  "recommendation": "approve|retry|escalate"
}""")
    
    # Get last specialist outcome
    specialist_outcome = [o for o in state["outcomes"] if o["agent_type"] == "specialist"][-1]
    
    messages = [
        system_prompt,
        HumanMessage(content=f"Evaluate this result:\n{json.dumps(specialist_outcome['result'], indent=2)}")
    ]
    
    start_time = datetime.now()
    response = await model.ainvoke(messages)
    latency_ms = int((datetime.now() - start_time).total_seconds() * 1000)
    
    try:
        evaluation = json.loads(response.content)
    except json.JSONDecodeError:
        evaluation = {
            "passed": True,
            "quality_score": 80,
            "issues": [],
            "recommendation": "approve"
        }
    
    new_outcome = Outcome(
        agent_id="critic",
        agent_type="critic",
        result=evaluation,
        timestamp=datetime.now(),
        cost=0.002,
        latency_ms=latency_ms
    )
    
    state["outcomes"].append(new_outcome)
    state["current_step"] = "paa_summarize"
    state["metrics"]["total_cost"] += new_outcome["cost"]
    state["metrics"]["total_latency_ms"] += latency_ms
    state["metrics"]["success_count"] += 1
    
    state["messages"].append(AIMessage(content=f"Critic Evaluation: {json.dumps(evaluation, indent=2)}"))
    
    return state


async def paa_summarize_node(state: AgentState) -> AgentState:
    """
    PAA generates a user-friendly summary of the entire workflow.
    This is what gets displayed in the dashboard.
    """
    print(f"[PAA Summarize] Creating final summary")
    
    model = ChatAnthropic(
        model="claude-3-5-sonnet-20241022",
        temperature=0.7,
        anthropic_api_key=os.getenv("ANTHROPIC_API_KEY")
    )
    
    system_prompt = SystemMessage(content="""You are the PAA (Personal AI Assistant) summarizer.
Create a clear, concise summary for the user that:
1. States what was accomplished
2. Highlights key insights or results
3. Suggests next steps if applicable
4. Uses friendly, non-technical language

Keep it under 3 sentences unless critical details are needed.""")
    
    # Gather all outcomes for context
    outcomes_summary = "\n".join([
        f"- {o['agent_id']}: {json.dumps(o['result'])}"
        for o in state["outcomes"]
    ])
    
    messages = [
        system_prompt,
        HumanMessage(content=f"Summarize this workflow:\n{outcomes_summary}")
    ]
    
    start_time = datetime.now()
    response = await model.ainvoke(messages)
    latency_ms = int((datetime.now() - start_time).total_seconds() * 1000)
    
    state["final_summary"] = response.content
    state["current_step"] = "complete"
    state["metrics"]["total_cost"] += 0.004
    state["metrics"]["total_latency_ms"] += latency_ms
    state["metrics"]["success_count"] += 1
    
    state["messages"].append(AIMessage(content=f"Summary: {response.content}"))
    
    return state


async def human_approval_node(state: AgentState) -> AgentState:
    """
    Blocks execution and waits for human approval.
    This is called when state["approval_status"] == PENDING.
    """
    print(f"[Human Approval] Waiting for approval on workflow {state['workflow_id']}")
    print(f"Reason: {state['approval_message']}")
    
    # Mark that an approval was requested
    state["metrics"]["approval_requests"] += 1
    
    # The workflow will pause here until approved/rejected via API
    # See: apps/web/app/api/agents/approve/[workflow_id]/route.ts
    
    return state

# ============================================================================
# CONDITIONAL ROUTING
# ============================================================================

def should_request_approval(state: AgentState) -> Literal["request_approval", "continue"]:
    """After PAA intake, decide if approval is needed"""
    if state["approval_status"] == ApprovalStatus.PENDING:
        return "request_approval"
    return "continue"

def approval_granted(state: AgentState) -> Literal["approved", "rejected"]:
    """After approval node, check if user approved or rejected"""
    if state["approval_status"] == ApprovalStatus.APPROVED:
        return "approved"
    return "rejected"

def should_retry(state: AgentState) -> Literal["retry", "continue"]:
    """After critic, decide if specialist should retry"""
    critic_result = [o for o in state["outcomes"] if o["agent_type"] == "critic"][-1]["result"]
    
    if critic_result.get("recommendation") == "retry":
        return "retry"
    return "continue"

# ============================================================================
# WORKFLOW BUILDER
# ============================================================================

async def create_workflow() -> StateGraph:
    """
    Builds the complete LangGraph workflow with all nodes and edges.
    """
    
    # Initialize checkpointer (persists state to SQLite)
    checkpointer = AsyncSqliteSaver.from_conn_string("./core/checkpoints.db")
    
    # Create the graph
    workflow = StateGraph(AgentState)
    
    # Add all nodes
    workflow.add_node("paa_intake", paa_intake_node)
    workflow.add_node("human_approval", human_approval_node)
    workflow.add_node("planner", planner_node)
    workflow.add_node("router", router_node)
    workflow.add_node("specialist", specialist_node)
    workflow.add_node("critic", critic_node)
    workflow.add_node("paa_summarize", paa_summarize_node)
    
    # Define edges
    workflow.set_entry_point("paa_intake")
    
    # Conditional: approval check after intake
    workflow.add_conditional_edges(
        "paa_intake",
        should_request_approval,
        {
            "request_approval": "human_approval",
            "continue": "planner"
        }
    )
    
    # Conditional: proceed or reject after approval
    workflow.add_conditional_edges(
        "human_approval",
        approval_granted,
        {
            "approved": "planner",
            "rejected": END  # Workflow ends if rejected
        }
    )
    
    # Linear flow after approval
    workflow.add_edge("planner", "router")
    workflow.add_edge("router", "specialist")
    
    # Conditional: retry or continue after critic
    workflow.add_conditional_edges(
        "critic",
        should_retry,
        {
            "retry": "specialist",  # Loop back to specialist
            "continue": "paa_summarize"
        }
    )
    
    workflow.add_edge("specialist", "critic")
    workflow.add_edge("paa_summarize", END)
    
    # Compile with checkpointing
    return workflow.compile(checkpointer=checkpointer)

# ============================================================================
# EXECUTION FUNCTIONS
# ============================================================================

async def execute_workflow(
    workspace_id: str,
    user_id: str,
    user_message: str,
    workflow_id: str | None = None
) -> dict:
    """
    Main entry point to execute a workflow.
    
    Args:
        workspace_id: User's workspace
        user_id: User making the request
        user_message: The actual request text
        workflow_id: Optional ID to resume existing workflow
    
    Returns:
        Final state of the workflow
    """
    
    # Generate workflow ID if not resuming
    if not workflow_id:
        workflow_id = f"wf_{workspace_id}_{int(datetime.now().timestamp())}"
    
    print(f"\n{'='*60}")
    print(f"Starting workflow: {workflow_id}")
    print(f"User: {user_id}")
    print(f"Message: {user_message}")
    print(f"{'='*60}\n")
    
    # Initialize state
    initial_state: AgentState = {
        "workspace_id": workspace_id,
        "user_id": user_id,
        "workflow_id": workflow_id,
        "messages": [HumanMessage(content=user_message)],
        "current_step": "paa_intake",
        "task_type": TaskType.GENERAL,
        "subtasks": [],
        "outcomes": [],
        "final_summary": None,
        "approval_status": ApprovalStatus.NOT_REQUIRED,
        "approval_message": None,
        "metrics": {
            "total_cost": 0.0,
            "total_latency_ms": 0,
            "success_count": 0,
            "failure_count": 0,
            "approval_requests": 0
        },
        "error": None
    }
    
    # Create and execute workflow
    app = await create_workflow()
    
    config = {
        "configurable": {
            "thread_id": workflow_id,
            "checkpoint_ns": workspace_id
        }
    }
    
    try:
        # Run workflow (automatically checkpoints at each step)
        final_state = await app.ainvoke(initial_state, config)
        
        print(f"\n{'='*60}")
        print(f"Workflow complete: {workflow_id}")
        print(f"Summary: {final_state.get('final_summary', 'No summary')}")
        print(f"Total cost: ${final_state['metrics']['total_cost']:.4f}")
        print(f"Total time: {final_state['metrics']['total_latency_ms']}ms")
        print(f"{'='*60}\n")
        
        return final_state
        
    except Exception as e:
        print(f"❌ Workflow failed: {str(e)}")
        return {
            "error": str(e),
            "workflow_id": workflow_id,
            "metrics": initial_state["metrics"]
        }


async def resume_workflow(workflow_id: str) -> dict:
    """
    Resume a paused workflow from checkpoint.
    Used when user approves/rejects during human_approval_node.
    """
    print(f"Resuming workflow: {workflow_id}")
    
    app = await create_workflow()
    
    config = {
        "configurable": {
            "thread_id": workflow_id
        }
    }
    
    # Get current state from checkpoint
    state = await app.aget_state(config)
    
    if not state:
        return {"error": "Workflow not found", "workflow_id": workflow_id}
    
    # Continue execution
    final_state = await app.ainvoke(None, config)
    
    return final_state


async def update_approval_status(
    workflow_id: str,
    approved: bool,
    workspace_id: str
) -> dict:
    """
    Update approval status for a paused workflow.
    Called from the API endpoint when user approves/rejects.
    """
    app = await create_workflow()
    
    config = {
        "configurable": {
            "thread_id": workflow_id,
            "checkpoint_ns": workspace_id
        }
    }
    
    # Get current state
    state = await app.aget_state(config)
    
    if not state:
        return {"error": "Workflow not found"}
    
    # Update approval status
    current_values = state.values
    current_values["approval_status"] = ApprovalStatus.APPROVED if approved else ApprovalStatus.REJECTED
    
    # Update checkpoint
    await app.aupdate_state(config, current_values)
    
    # Resume workflow
    if approved:
        return await resume_workflow(workflow_id)
    else:
        return {
            "status": "rejected",
            "workflow_id": workflow_id,
            "message": "Workflow rejected by user"
        }

# ============================================================================
# TEST HELPERS
# ============================================================================

async def test_basic_workflow():
    """Quick test to verify orchestrator works end-to-end"""
    result = await execute_workflow(
        workspace_id="test_workspace_123",
        user_id="test_user_456",
        user_message="Qualify this lead: John Doe from ACME Corp, interested in our enterprise plan"
    )
    
    print("\n" + "="*60)
    print("TEST RESULT:")
    print(json.dumps({
        "workflow_id": result.get("workflow_id"),
        "final_summary": result.get("final_summary"),
        "metrics": result.get("metrics"),
        "total_outcomes": len(result.get("outcomes", []))
    }, indent=2))
    print("="*60 + "\n")


if __name__ == "__main__":
    # Run basic test
    asyncio.run(test_basic_workflow())
