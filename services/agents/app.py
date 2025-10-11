from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from typing import Dict, Any, Optional
import os
import asyncio
import time

app = FastAPI(title="GalaxyCo.ai Agents Service", version="0.1.0")

# Enable CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ExecuteAgentRequest(BaseModel):
    """Request to execute an agent"""
    agent_id: str
    workspace_id: str
    user_id: str
    agent_type: str
    inputs: Dict[str, Any]
    config: Optional[Dict[str, Any]] = None


class ExecuteAgentResponse(BaseModel):
    """Response from agent execution"""
    execution_id: str
    agent_id: str
    success: bool
    outputs: Dict[str, Any]
    error: Optional[str] = None
    metrics: Dict[str, Any]


@app.get("/")
def root():
    return {
        "message": "GalaxyCo.ai Agents Service v2.0",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "galaxyco-agents",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "environment": os.getenv("ENV", "development"),
        "openai_configured": bool(os.getenv("OPENAI_API_KEY")),
        "anthropic_configured": bool(os.getenv("ANTHROPIC_API_KEY")),
    }


@app.post("/execute", response_model=ExecuteAgentResponse)
async def execute_agent(request: ExecuteAgentRequest):
    """
    Execute an agent with given inputs.
    
    MVP Implementation: Simple LangChain call without full orchestration.
    Future: Will use full LangGraph orchestrator from core/orchestrator.py
    """
    start_time = time.time()
    
    try:
        # Import here to avoid circular dependencies
        from langchain_openai import ChatOpenAI
        from langchain_core.messages import SystemMessage, HumanMessage
        
        # Check API key
        if not os.getenv("OPENAI_API_KEY"):
            raise HTTPException(
                status_code=500,
                detail="OpenAI API key not configured"
            )
        
        # Initialize model
        model = ChatOpenAI(
            model=request.config.get("model", "gpt-4o-mini") if request.config else "gpt-4o-mini",
            temperature=request.config.get("temperature", 0.7) if request.config else 0.7,
        )
        
        # Build system prompt based on agent type
        system_prompt = get_system_prompt(request.agent_type, request.config)
        
        # Build user message from inputs
        user_message = format_inputs_for_agent(request.inputs, request.agent_type)
        
        # Execute
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_message),
        ]
        
        response = await model.ainvoke(messages)
        
        # Calculate metrics
        duration_ms = int((time.time() - start_time) * 1000)
        
        # Parse response based on agent type
        outputs = parse_agent_output(response.content, request.agent_type)
        
        return ExecuteAgentResponse(
            execution_id=f"exec_{int(time.time() * 1000)}",
            agent_id=request.agent_id,
            success=True,
            outputs=outputs,
            metrics={
                "duration_ms": duration_ms,
                "model": model.model_name,
                "tokens_used": response.response_metadata.get("token_usage", {}).get("total_tokens", 0),
                "cost_usd": estimate_cost(response.response_metadata.get("token_usage", {}), model.model_name),
            },
        )
        
    except Exception as e:
        duration_ms = int((time.time() - start_time) * 1000)
        
        return ExecuteAgentResponse(
            execution_id=f"exec_{int(time.time() * 1000)}",
            agent_id=request.agent_id,
            success=False,
            outputs={},
            error=str(e),
            metrics={
                "duration_ms": duration_ms,
                "error": True,
            },
        )


def get_system_prompt(agent_type: str, config: Optional[Dict[str, Any]] = None) -> str:
    """Get system prompt based on agent type"""
    
    # Use custom prompt if provided
    if config and "systemPrompt" in config:
        return config["systemPrompt"]
    
    # Default prompts by agent type
    prompts = {
        "scope": """You are a Scope Agent that analyzes emails and extracts action items.
        
Analyze the provided email and identify:
        1. Key action items that need to be completed
        2. Priority level (high, medium, low)
        3. Overall sentiment of the email
        
Provide a concise summary and list of actionable items.""",
        
        "email": """You are an Email Composer Agent that drafts professional email responses.
        
Based on the provided context and requirements, compose a clear, professional email response.
Match the tone to the situation and ensure all key points are addressed.""",
        
        "call": """You are a Call Summary Agent that analyzes sales call transcripts.
        
Review the call transcript and identify:
        1. Key discussion points
        2. Customer needs and pain points
        3. Next steps and action items
        4. Deal stage and qualification level""",
        
        "custom": """You are a helpful AI assistant.
        
Analyze the provided input and generate a helpful, accurate response.""",
    }
    
    return prompts.get(agent_type, prompts["custom"])


def format_inputs_for_agent(inputs: Dict[str, Any], agent_type: str) -> str:
    """Format inputs into a user message"""
    
    if agent_type == "scope" and "email_content" in inputs:
        return f"""Email to analyze:
        
Subject: {inputs.get('subject', 'No subject')}

{inputs['email_content']}

Please provide your analysis."""
    
    if agent_type == "email" and "context" in inputs:
        return f"""Context: {inputs['context']}
        
Requirements: {inputs.get('requirements', 'Draft a professional response')}

Please compose the email."""
    
    if agent_type == "call" and "transcript" in inputs:
        return f"""Call Transcript:

{inputs['transcript']}

Please analyze this call and provide a summary."""
    
    # Generic format for other types
    formatted = "Input data:\n\n"
    for key, value in inputs.items():
        formatted += f"{key}: {value}\n"
    
    return formatted


def parse_agent_output(content: str, agent_type: str) -> Dict[str, Any]:
    """Parse agent output into structured format"""
    
    # For MVP, return the content as-is with some structure
    # Future: Use structured outputs with Pydantic models
    
    return {
        "content": content,
        "agent_type": agent_type,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }


def estimate_cost(token_usage: Dict[str, int], model: str) -> float:
    """Estimate cost based on token usage"""
    
    # Cost per 1M tokens (approximate as of 2024)
    costs = {
        "gpt-4o": {"input": 2.50, "output": 10.00},
        "gpt-4o-mini": {"input": 0.15, "output": 0.60},
        "gpt-4-turbo": {"input": 10.00, "output": 30.00},
    }
    
    model_costs = costs.get(model, costs["gpt-4o-mini"])
    
    input_tokens = token_usage.get("prompt_tokens", 0)
    output_tokens = token_usage.get("completion_tokens", 0)
    
    input_cost = (input_tokens / 1_000_000) * model_costs["input"]
    output_cost = (output_tokens / 1_000_000) * model_costs["output"]
    
    return round(input_cost + output_cost, 6)
