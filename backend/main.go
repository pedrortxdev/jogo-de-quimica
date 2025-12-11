package main

import (
	"gamequimica-backend/handlers"
	"gamequimica-backend/storage"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	storage.InitDB()

	r := gin.Default()

	// CORS Setup for Next.js
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // In prod, restrict to domain
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	api := r.Group("/api")
	{
		api.POST("/register", handlers.RegisterPlayer)
		api.GET("/question", handlers.GetQuestion)
		api.POST("/submit", handlers.SubmitAnswer)
		api.GET("/leaderboard", handlers.GetLeaderboard)
	}

	r.Run("0.0.0.0:8030")
}
