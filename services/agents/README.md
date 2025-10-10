# GalaxyCo.ai Agent Services

Multi-agent orchestration system using LangGraph for intelligent workflow automation.

## 🏗️ Architecture

```
services/agents/
├── core/           # LangGraph orchestrator (Phase 1.1 ✅)
├── specialists/    # Task-specific agents (Phase 1.2 ⬜)
├── paa/            # Personal AI Assistant services (Phase 1.3 ⬜)
└── tests/          # Test suite
```

## 🚀 Quick Start

### Setup

```bash
cd services/agents

# Install dependencies
pip install -r requirements.txt

# Set environment variables (in .env)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

### Run Tests

```bash
# All tests
pytest tests/ -v

# Specific test file
pytest tests/test_orchestrator.py -v

# With coverage
pytest tests/ --cov=core --cov=specialists --cov=paa
```

### Run Orchestrator Test

```bash
# Built-in test workflow
python core/orchestrator.py
```

## 📦 Phase 1.1: LangGraph Orchestrator (COMPLETE ✅)

### What's Implemented

- ✅ 7-node workflow: PAA Intake → Planner → Router → Specialist → Critic → PAA Summarize
- ✅ SQLite checkpointing for state persistence
- ✅ Human-in-the-loop approval gates
- ✅ Async/await throughout
- ✅ Cost and latency tracking
- ✅ Comprehensive error handling

### Usage Example

```python
import asyncio
from core.orchestrator import execute_workflow

async def main():
    result = await execute_workflow(
        workspace_id="workspace_123",
        user_id="user_456",
        user_message="Qualify this lead: John Doe from ACME Corp"
    )

    print(f"Summary: {result['final_summary']}")
    print(f"Cost: ${result['metrics']['total_cost']:.4f}")
    print(f"Duration: {result['metrics']['total_latency_ms']}ms")

asyncio.run(main())
```

### Workflow Nodes

| Node             | Model             | Purpose                                |
| ---------------- | ----------------- | -------------------------------------- |
| `paa_intake`     | Claude 3.5 Sonnet | Analyze request, classify task type    |
| `human_approval` | N/A               | Block for user approval if needed      |
| `planner`        | GPT-4o            | Break request into subtasks            |
| `router`         | N/A               | Route to appropriate specialist        |
| `specialist`     | (Phase 1.2)       | Execute task with structured output    |
| `critic`         | GPT-4o            | Evaluate quality, decide retry/approve |
| `paa_summarize`  | Claude 3.5 Sonnet | Create user-friendly summary           |

## 📋 Phase 1.2: Specialist Agents (NEXT)

### To Be Implemented (Days 4-6)

- [ ] Lead Qualifier with OpenAI structured outputs
- [ ] Email Composer with strict schema validation
- [ ] Data Enricher with error handling
- [ ] Integration with orchestrator

### Specialist Template

```python
# services/agents/specialists/lead_qualifier.py

from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

class LeadQualification(BaseModel):
    """Structured output for lead qualification"""
    lead_score: int = Field(ge=0, le=100)
    qualification_level: str = Field(pattern="^(hot|warm|cold|unqualified)$")
    next_action: str
    reasoning: str

async def qualify_lead(lead_data: dict) -> LeadQualification:
    model = ChatOpenAI(model="gpt-4o").with_structured_output(LeadQualification)
    result = await model.ainvoke(f"Qualify this lead: {lead_data}")
    return result
```

## 📚 Documentation

### Key Documents

- [Phase 1.1 Completion Summary](../../docs/planning/PHASE_1.1_COMPLETION_SUMMARY.md)
- [22-Day Implementation Plan](../../docs/planning/22_DAY_IMPLEMENTATION_PLAN.md)
- [Session Handoff](../../docs/planning/SESSION_HANDOFF.md)

### API Reference

```python
# Execute new workflow
execute_workflow(workspace_id, user_id, user_message, workflow_id=None)

# Resume paused workflow
resume_workflow(workflow_id)

# Update approval status
update_approval_status(workflow_id, approved, workspace_id)
```

## 🧪 Testing

### Test Structure

```python
# tests/test_orchestrator.py

class TestOrchestratorBasics:
    """Test imports and basic functionality"""

class TestWorkflowExecution:
    """Test full workflow with real API calls (requires keys)"""

class TestStateManagement:
    """Test state schema and persistence"""

class TestErrorHandling:
    """Test error scenarios and edge cases"""
```

### Run Specific Tests

```bash
# Only basic tests (no API keys needed)
pytest tests/test_orchestrator.py::TestOrchestratorBasics -v

# Integration tests (requires API keys)
pytest tests/test_orchestrator.py::TestWorkflowExecution -v
```

## 🔧 Configuration

### Environment Variables

```bash
# Required
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Optional
CHECKPOINT_DB_PATH=./core/checkpoints.db  # Default location
LOG_LEVEL=INFO
```

### Dependencies

- `langgraph>=0.2.0` - Workflow orchestration
- `langgraph-checkpoint-sqlite>=1.0.0` - State persistence
- `langchain>=0.3.0` - LLM framework
- `langchain-openai>=0.2.0` - OpenAI integration
- `langchain-anthropic>=0.2.0` - Anthropic integration
- `openai>=1.54.0` - OpenAI API client
- `anthropic>=0.39.0` - Anthropic API client
- `pytest>=8.0.0` - Testing framework

## 🐛 Troubleshooting

### Common Issues

**Import Error: `ModuleNotFoundError: No module named 'langgraph.checkpoint.sqlite'`**

```bash
pip install langgraph-checkpoint-sqlite
```

**Workflow Hangs on Human Approval**

- The workflow is waiting for approval via `update_approval_status()`
- Check workflow state: `workflow.aget_state(config)`
- Approve: `update_approval_status(workflow_id, True, workspace_id)`

**Test Failures with API Keys**

- Integration tests require real API keys
- Set `OPENAI_API_KEY` and `ANTHROPIC_API_KEY` in environment
- Or skip with: `pytest -m "not integration"`

## 📊 Project Status

| Phase            | Status      | Files | Lines | Duration |
| ---------------- | ----------- | ----- | ----- | -------- |
| 1.1 Orchestrator | ✅ Complete | 6     | 913   | 3 days   |
| 1.2 Specialists  | ⬜ Next     | -     | -     | 3 days   |
| 1.3 PAA Services | ⬜ Pending  | -     | -     | 3 days   |
| 1.4 Model Router | ⬜ Pending  | -     | -     | 1 day    |

**Overall Progress: 3/22 days (13.6%)**

## 🎯 Next Actions

1. Begin Phase 1.2: Specialist Agents
2. Implement Lead Qualifier with structured outputs
3. Add Email Composer with schema validation
4. Create Data Enricher with error handling
5. Update orchestrator to dispatch to real specialists
6. Write comprehensive tests for each specialist

---

Built with ❤️ for GalaxyCo.ai  
Using LangGraph + LangChain + OpenAI + Anthropic
