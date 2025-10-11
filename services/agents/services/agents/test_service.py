#!/usr/bin/env python3
"""
Test script for the FastAPI agents service
Tests both the health endpoint and the execute endpoint
"""

import asyncio
import json
import httpx
from typing import Dict, Any

SERVICE_URL = "http://localhost:5001"

async def test_health():
    """Test the health endpoint"""
    print("🔍 Testing health endpoint...")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{SERVICE_URL}/health")
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Health check passed")
                print(f"   Service: {data.get('service')}")
                print(f"   Environment: {data.get('environment')}")
                print(f"   OpenAI configured: {data.get('openai_configured')}")
                print(f"   Anthropic configured: {data.get('anthropic_configured')}")
                return True
            else:
                print(f"❌ Health check failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Health check error: {e}")
            return False

async def test_execute():
    """Test the execute endpoint with mock data"""
    print("\n🔍 Testing execute endpoint...")
    
    test_payload = {
        "agent_id": "test-agent-123",
        "workspace_id": "test-workspace-456", 
        "user_id": "test-user-789",
        "agent_type": "scope",
        "inputs": {
            "email_content": "Hi team, I need to schedule a meeting for next week to discuss the Q4 roadmap. Please let me know your availability.",
            "subject": "Q4 Planning Meeting"
        },
        "config": {
            "model": "gpt-4o-mini",
            "temperature": 0.7,
            "systemPrompt": "You are a helpful email analysis assistant."
        }
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{SERVICE_URL}/execute",
                json=test_payload,
                timeout=30.0
            )
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Execute test passed")
                print(f"   Execution ID: {data.get('execution_id')}")
                print(f"   Success: {data.get('success')}")
                print(f"   Duration: {data.get('metrics', {}).get('duration_ms', 0)}ms")
                print(f"   Model: {data.get('metrics', {}).get('model')}")
                
                if data.get('success'):
                    print("   Output preview:")
                    output_preview = str(data.get('outputs', {}))[:200]
                    print(f"     {output_preview}...")
                else:
                    print(f"   Error: {data.get('error')}")
                    
                return True
            else:
                print(f"❌ Execute test failed: {response.status_code}")
                error_text = await response.aread()
                print(f"   Error: {error_text}")
                return False
                
        except Exception as e:
            print(f"❌ Execute test error: {e}")
            return False

async def main():
    """Run all tests"""
    print("🚀 Starting Python FastAPI service tests...\n")
    
    # Test health endpoint
    health_ok = await test_health()
    
    if health_ok:
        # Test execute endpoint
        execute_ok = await test_execute()
        
        if health_ok and execute_ok:
            print("\n🎉 All tests passed! Service is working correctly.")
            return True
        else:
            print("\n⚠️  Some tests failed. Check the output above.")
            return False
    else:
        print("\n❌ Service is not running or not responding to health checks.")
        print("💡 Try starting the service with: python app.py")
        return False

if __name__ == "__main__":
    asyncio.run(main())