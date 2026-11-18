package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"
)

func healthHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	if r.Method != http.MethodGet {
		writeJSON(
			w,
			http.StatusMethodNotAllowed,
			map[string]string{
				"error": "method not allowed",
			},
		)

		return
	}

	writeJSON(
		w,
		http.StatusOK,
		map[string]interface{}{
			"ok": true,

			"service": "fjk-chat",

			"mode": "byok-provider-proxy",

			"providers": []string{
				"deepseek",
				"openai",
				"openrouter",
			},
		},
	)
}

func chatHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	if r.Method != http.MethodPost {
		writeJSON(
			w,
			http.StatusMethodNotAllowed,
			map[string]string{
				"error": "method not allowed",
			},
		)

		return
	}

	if !allowRequest(r) {
		writeJSON(
			w,
			http.StatusTooManyRequests,
			map[string]string{
				"error": "too many requests",
			},
		)

		return
	}

	r.Body =
		http.MaxBytesReader(
			w,
			r.Body,
			maxBodyBytes,
		)

	defer r.Body.Close()

	var payload ChatRequest

	if err :=
		json.NewDecoder(
			r.Body,
		).Decode(
			&payload,
		); err != nil {

		writeJSON(
			w,
			http.StatusBadRequest,
			map[string]string{
				"error": "invalid json",
			},
		)

		return
	}

	message :=
		strings.TrimSpace(
			payload.Message,
		)

	providerID :=
		strings.ToLower(
			strings.TrimSpace(
				payload.Provider,
			),
		)

	model :=
		strings.TrimSpace(
			payload.Model,
		)

	apiKey :=
		strings.TrimSpace(
			r.Header.Get(
				"X-AI-Key",
			),
		)

	if message == "" {
		writeJSON(
			w,
			http.StatusBadRequest,
			map[string]string{
				"error": "message is required",
			},
		)

		return
	}

	if len(
		[]rune(message),
	) > maxMessageLength {

		writeJSON(
			w,
			http.StatusBadRequest,
			map[string]string{
				"error": "message is too long",
			},
		)

		return
	}

	provider, ok :=
		providers[providerID]

	if !ok {
		writeJSON(
			w,
			http.StatusBadRequest,
			map[string]string{
				"error": "unsupported provider",
			},
		)

		return
	}

	if !validateModel(model) {
		writeJSON(
			w,
			http.StatusBadRequest,
			map[string]string{
				"error": "invalid model",
			},
		)

		return
	}

	if !validateAPIKey(apiKey) {
		writeJSON(
			w,
			http.StatusUnauthorized,
			map[string]string{
				"error": "API key is required",
			},
		)

		return
	}

	/*
	   绝不记录：
	   API Key
	   用户消息正文
	*/
	log.Printf(
		"[chat] ip=%s provider=%s model=%s",
		clientIP(r),
		providerID,
		model,
	)

	streamProvider(
		w,
		r,
		provider,
		model,
		apiKey,
		message,
	)
}

func main() {
	mux :=
		http.NewServeMux()

	mux.HandleFunc(
		"/health",
		healthHandler,
	)

	mux.HandleFunc(
		"/api/chat",
		chatHandler,
	)

	server :=
		&http.Server{
			Addr: host +
				":" +
				port,

			Handler: mux,

			ReadHeaderTimeout: 10 *
				time.Second,

			ReadTimeout: 30 *
				time.Second,

			WriteTimeout: 180 *
				time.Second,

			IdleTimeout: 30 *
				time.Second,
		}

	log.Printf(
		"[fjk-chat] listening on http://%s:%s",
		host,
		port,
	)

	log.Println(
		"[fjk-chat] mode: BYOK provider proxy",
	)

	log.Println(
		"[fjk-chat] providers: deepseek, openai, openrouter",
	)

	if err :=
		server.ListenAndServe(); err != nil &&
		err != http.ErrServerClosed {

		log.Fatal(err)
	}
}
