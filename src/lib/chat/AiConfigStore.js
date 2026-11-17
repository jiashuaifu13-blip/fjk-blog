export const AI_PROVIDERS = [
  {
    id: 'deepseek',
    label: 'DeepSeek',
    defaultModel: 'deepseek-flash',
  },

  {
    id: 'openai',
    label: 'OpenAI',
    defaultModel: '',
  },

  {
    id: 'openrouter',
    label: 'OpenRouter',
    defaultModel: '',
  },
]


const STORAGE_KEY =
  'fjk-ai-config-v1'


const PROVIDER_IDS =
  new Set(
    AI_PROVIDERS.map(
      (provider) =>
        provider.id
    )
  )


export class AiConfigStore {

  constructor({
    storageKey = STORAGE_KEY,
  } = {}) {

    this.storageKey =
      storageKey
  }


  get() {

    if (
      typeof window ===
      'undefined'
    ) {
      return null
    }


    try {

      const raw =
        window.sessionStorage
          .getItem(
            this.storageKey
          )


      if (!raw) {
        return null
      }


      const data =
        JSON.parse(
          raw
        )


      return this.normalize(
        data
      )

    } catch (error) {

      console.warn(
        '[FJK AI Config] failed to read configuration',
        error
      )


      return null
    }
  }


  save({
    provider,
    model,
    apiKey,
  }) {

    const config =
      this.normalize({
        provider,
        model,
        apiKey,
      })


    if (!config) {

      throw new Error(
        'AI configuration is incomplete'
      )
    }


    window.sessionStorage
      .setItem(
        this.storageKey,
        JSON.stringify(
          config
        )
      )


    return config
  }


  clear() {

    if (
      typeof window ===
      'undefined'
    ) {
      return
    }


    window.sessionStorage
      .removeItem(
        this.storageKey
      )
  }


  isConfigured() {

    return Boolean(
      this.get()
    )
  }


  normalize(
    value
  ) {

    if (
      !value ||
      typeof value !==
        'object'
    ) {
      return null
    }


    const provider =
      String(
        value.provider ??
        ''
      ).trim()


    const model =
      String(
        value.model ??
        ''
      ).trim()


    const apiKey =
      String(
        value.apiKey ??
        ''
      ).trim()


    if (
      !PROVIDER_IDS.has(
        provider
      )
    ) {
      return null
    }


    if (
      !model ||
      !apiKey
    ) {
      return null
    }


    return {
      provider,
      model,
      apiKey,
    }
  }


  getProvider(
    id
  ) {

    return (
      AI_PROVIDERS.find(
        (provider) =>
          provider.id ===
          id
      ) ??
      null
    )
  }


  getDefaultModel(
    providerId
  ) {

    return (
      this.getProvider(
        providerId
      )
        ?.defaultModel ??
      ''
    )
  }
}