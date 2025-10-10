"""
Tests for the LangGraph orchestrator
=====================================

Run with: pytest tests/test_orchestrator.py -v
"""

import pytest
import asyncio
import os
from datetime import datetime

# Set test environment variables if not already set
if not os.getenv("OPENAI_API_KEY"):
    os.environ["OPENAI_API_KEY"] = "test_key"
if not os.getenv("ANTHROPIC_API_KEY"):
    os.environ["ANTHROPIC_API_KEY"] = "test_key"

from core.orchestrator import (
    execute_workflow,
    AgentState,
    TaskType,
    ApprovalStatus
)


class TestOrchestratorBasics:
    """Test basic orchestrator functionality"""
    
    def test_imports(self):
        """Verify all required imports work"""
        from core.orchestrator import (
            execute_workflow,
            resume_workflow,
            update_approval_status,
            TaskType,
            ApprovalStatus
        )
        assert execute_workflow is not None
        assert resume_workflow is not None
        assert update_approval_status is not None
        assert TaskType.LEAD_QUALIFICATION is not None
        assert ApprovalStatus.PENDING is not None
    
    def test_task_types(self):
        """Verify TaskType enum"""
        assert TaskType.LEAD_QUALIFICATION.value == "lead_qualification"
        assert TaskType.EMAIL_COMPOSITION.value == "email_composition"
        assert TaskType.DATA_ENRICHMENT.value == "data_enrichment"
        assert TaskType.GENERAL.value == "general"
    
    def test_approval_status(self):
        """Verify ApprovalStatus enum"""
        assert ApprovalStatus.PENDING.value == "pending"
        assert ApprovalStatus.APPROVED.value == "approved"
        assert ApprovalStatus.REJECTED.value == "rejected"
        assert ApprovalStatus.NOT_REQUIRED.value == "not_required"


class TestWorkflowExecution:
    """Test workflow execution (integration tests - requires API keys)"""
    
    @pytest.mark.asyncio
    @pytest.mark.skipif(
        not os.getenv("OPENAI_API_KEY") or os.getenv("OPENAI_API_KEY") == "test_key",
        reason="Requires real OPENAI_API_KEY"
    )
    async def test_basic_workflow_execution(self):
        """Test a complete workflow execution"""
        result = await execute_workflow(
            workspace_id="test_workspace",
            user_id="test_user",
            user_message="Qualify this lead: Jane Smith from Tech Corp"
        )
        
        # Check result structure
        assert "workflow_id" in result
        assert "outcomes" in result
        assert "metrics" in result
        assert "final_summary" in result
        
        # Check outcomes
        assert len(result["outcomes"]) > 0
        
        # Check metrics
        assert result["metrics"]["total_cost"] >= 0
        assert result["metrics"]["total_latency_ms"] > 0
        assert result["metrics"]["success_count"] > 0
    
    @pytest.mark.asyncio
    @pytest.mark.skipif(
        not os.getenv("OPENAI_API_KEY") or os.getenv("OPENAI_API_KEY") == "test_key",
        reason="Requires real OPENAI_API_KEY"
    )
    async def test_workflow_with_custom_id(self):
        """Test workflow with custom workflow_id"""
        custom_id = f"test_wf_{int(datetime.now().timestamp())}"
        
        result = await execute_workflow(
            workspace_id="test_workspace",
            user_id="test_user",
            user_message="Test message",
            workflow_id=custom_id
        )
        
        assert result["workflow_id"] == custom_id


class TestStateManagement:
    """Test state structure and management"""
    
    def test_agent_state_structure(self):
        """Verify AgentState type structure"""
        # This is a compile-time check, but we can verify the annotations
        from core.orchestrator import AgentState
        
        # Get type hints
        hints = AgentState.__annotations__
        
        assert "workspace_id" in hints
        assert "user_id" in hints
        assert "workflow_id" in hints
        assert "messages" in hints
        assert "current_step" in hints
        assert "task_type" in hints
        assert "outcomes" in hints
        assert "metrics" in hints
        assert "approval_status" in hints


class TestErrorHandling:
    """Test error handling and edge cases"""
    
    @pytest.mark.asyncio
    async def test_missing_api_keys(self):
        """Test behavior when API keys are missing"""
        # Temporarily remove API keys
        openai_key = os.environ.pop("OPENAI_API_KEY", None)
        anthropic_key = os.environ.pop("ANTHROPIC_API_KEY", None)
        
        try:
            result = await execute_workflow(
                workspace_id="test_workspace",
                user_id="test_user",
                user_message="Test message"
            )
            
            # Should return error in result
            assert "error" in result or result.get("metrics", {}).get("failure_count", 0) > 0
            
        finally:
            # Restore API keys
            if openai_key:
                os.environ["OPENAI_API_KEY"] = openai_key
            if anthropic_key:
                os.environ["ANTHROPIC_API_KEY"] = anthropic_key


if __name__ == "__main__":
    # Run tests with pytest
    pytest.main([__file__, "-v"])
