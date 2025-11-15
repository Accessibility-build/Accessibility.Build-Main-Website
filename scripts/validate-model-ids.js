#!/usr/bin/env node

/**
 * Script to validate all model IDs against OpenRouter's current offerings
 * Run with: node scripts/validate-model-ids.js
 */

require('dotenv').config({ path: '.env.local' })

// Our current model configuration
const OUR_MODELS = [
    // OpenAI Models (not validated via OpenRouter)
    { id: 'gpt-4o', provider: 'openai', name: 'GPT-4o' },
    { id: 'gpt-4o-mini', provider: 'openai', name: 'GPT-4o Mini' },
    { id: 'o3-mini', provider: 'openai', name: 'o3-mini (Reasoning)' },

    // OpenRouter Models
    { id: 'anthropic/claude-3.5-sonnet', provider: 'openrouter', name: 'Claude 3.5 Sonnet' },
    { id: 'anthropic/claude-sonnet-4', provider: 'openrouter', name: 'Claude Sonnet 4' },
    { id: 'anthropic/claude-3-haiku', provider: 'openrouter', name: 'Claude 3 Haiku' },
    { id: 'google/gemini-2.0-flash-001', provider: 'openrouter', name: 'Gemini 2.0 Flash' },
    { id: 'google/gemini-pro-1.5', provider: 'openrouter', name: 'Gemini Pro 1.5' },
    { id: 'meta-llama/llama-3.3-70b-instruct', provider: 'openrouter', name: 'Llama 3.3 70B' },
    { id: 'meta-llama/llama-3.1-405b-instruct', provider: 'openrouter', name: 'Llama 3.1 405B' },
    { id: 'deepseek/deepseek-chat-v3.1', provider: 'openrouter', name: 'DeepSeek Chat V3.1' },
    { id: 'deepseek/deepseek-r1', provider: 'openrouter', name: 'DeepSeek R1' },
    { id: 'mistralai/mistral-large-2407', provider: 'openrouter', name: 'Mistral Large' }
]

async function validateModelIds() {
    console.log('🔍 Validating All Model IDs\n')

    const openrouterApiKey = process.env.OPENROUTER_API_KEY

    if (!openrouterApiKey) {
        console.log('❌ OpenRouter API key not found. Cannot validate OpenRouter models.')
        return
    }

    console.log('📋 Fetching current OpenRouter model list...')

    try {
        const response = await fetch('https://openrouter.ai/api/v1/models', {
            headers: {
                'Authorization': `Bearer ${openrouterApiKey}`
            }
        })

        const data = await response.json()
        const availableModelIds = data.data.map(model => model.id)

        console.log(`✅ Found ${availableModelIds.length} available models on OpenRouter\n`)

        // Validate each model
        console.log('🎯 Model Validation Results:\n')

        let validCount = 0
        let invalidCount = 0

        for (const model of OUR_MODELS) {
            if (model.provider === 'openai') {
                console.log(`✅ ${model.name} (${model.id}) - OpenAI model (not validated via OpenRouter)`)
                validCount++
            } else if (model.provider === 'openrouter') {
                const isValid = availableModelIds.includes(model.id)
                if (isValid) {
                    console.log(`✅ ${model.name} (${model.id}) - Valid`)
                    validCount++
                } else {
                    console.log(`❌ ${model.name} (${model.id}) - INVALID`)
                    invalidCount++

                    // Try to find similar models
                    const similarModels = availableModelIds.filter(id =>
                        id.includes(model.id.split('/')[1] ? .split('-')[0] || '') ||
                        id.includes(model.id.split('/')[0] || '')
                    ).slice(0, 3)

                    if (similarModels.length > 0) {
                        console.log(`   💡 Similar available models: ${similarModels.join(', ')}`)
                    }
                }
            }
        }

        console.log(`\n📊 Summary:`)
        console.log(`✅ Valid models: ${validCount}`)
        console.log(`❌ Invalid models: ${invalidCount}`)

        if (invalidCount > 0) {
            console.log(`\n⚠️  Found ${invalidCount} invalid model(s). Please update the configuration.`)
        } else {
            console.log(`\n🎉 All models are valid!`)
        }

    } catch (error) {
        console.log('❌ Error fetching models from OpenRouter:', error.message)
    }
}

validateModelIds().catch(console.error)