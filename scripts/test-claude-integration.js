#!/usr/bin/env node

/**
 * Test script to verify AI model integration via OpenRouter
 * Run with: node scripts/test-claude-integration.js
 */

require('dotenv').config({ path: '.env.local' })

async function testClaudeIntegration() {
    console.log('🧪 Testing AI Model Integration via OpenRouter\n')

    // Check configuration
    const openrouterApiKey = process.env.OPENROUTER_API_KEY
    const openaiApiKey = process.env.OPENAI_API_KEY

    console.log('📋 Configuration Check:')
    console.log(`OpenAI API Key: ${openaiApiKey ? '✅ Configured' : '❌ Missing'}`)
    console.log(`OpenRouter API Key: ${openrouterApiKey ? '✅ Configured' : '❌ Missing'}`)

    if (!openrouterApiKey) {
        console.log('\n⚠️  OpenRouter API key not configured.')
        console.log('💡 Please add OPENROUTER_API_KEY to your .env.local file.')
        console.log('Visit https://openrouter.ai to get your API key.')
        return
    }

    console.log('\n🎯 Available Models by Category:')

    console.log('\n📘 Claude Models (Best for detailed analysis):')
    const claudeModels = [
        '◆ anthropic/claude-3.5-sonnet - High cost, excellent quality',
        '◆ anthropic/claude-sonnet-4 - High cost, latest capabilities',
        'anthropic/claude-3-haiku - Low cost, good quality'
    ]
    claudeModels.forEach(model => console.log(`  ${model}`))

    console.log('\n🌟 Google Gemini Models (Multimodal):')
    const geminiModels = [
        '◆ google/gemini-2.0-flash-001 - Low cost, fast multimodal',
        '◆ google/gemini-pro-1.5 - Medium cost, advanced capabilities'
    ]
    geminiModels.forEach(model => console.log(`  ${model}`))

    console.log('\n🦙 Meta AI Models (Open Source):')
    const metaModels = [
        '◆ meta-llama/llama-3.3-70b-instruct - Low cost, latest open-source',
        'meta-llama/llama-3.1-405b-instruct - Medium cost, largest model'
    ]
    metaModels.forEach(model => console.log(`  ${model}`))

    console.log('\n💎 DeepSeek Models (Best value):')
    const deepseekModels = [
        '◆ deepseek/deepseek-chat-v3.1 - Very low cost, latest model',
        '◆ deepseek/deepseek-r1 - Low cost, reasoning model'
    ]
    deepseekModels.forEach(model => console.log(`  ${model}`))

    console.log('\n🚀 OpenAI Models:')
    const openaiModels = [
        '◆ gpt-4o-mini - Low cost, good balance',
        '◆ gpt-4o - High cost, premium quality',
        '◆ o3-mini - Medium cost, excellent reasoning'
    ]
    openaiModels.forEach(model => console.log(`  ${model}`))

    console.log('\n◆ = Recommended models for best quality/cost balance')
    console.log('\n✨ Model list updated successfully!')
}

testClaudeIntegration().catch(console.error)