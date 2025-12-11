package handlers

import (
	"gamequimica-backend/game"
	"gamequimica-backend/models"
	"gamequimica-backend/storage"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func RegisterPlayer(c *gin.Context) {
	var body struct {
		Username string `json:"username"`
	}
	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Corpo inválido"})
		return
	}

	id := uuid.New().String()
	p := &models.Player{
		ID:       id,
		Username: body.Username,
		Score:    0,
		Streak:   0,
	}
	
	storage.DB.UpsertPlayer(p)
	c.JSON(http.StatusOK, p)
}

func GetQuestion(c *gin.Context) {
	q := game.GenerateQuestion()
	c.JSON(http.StatusOK, q)
}

func SubmitAnswer(c *gin.Context) {
	var req models.AnswerRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Corpo inválido"})
		return
	}

	correct, msg, realVal := game.CheckAnswer(req)
	
	// Update Player
	player, ok := storage.DB.Players[req.PlayerID]
	if !ok {
		// If player logic is strict, return error. For now, loose:
		player = &models.Player{ID: req.PlayerID, Score: 0}
	}

	points := 0
	if correct {
		points = 100 + (player.Streak * 10) // Bonus for streak
		player.Score += points
		player.Streak++
		if player.Score > player.Highscore {
			player.Highscore = player.Score
		}
	} else {
		player.Streak = 0
		// Optional: Penalty?
	}
	
	storage.DB.UpsertPlayer(player)

	c.JSON(http.StatusOK, gin.H{
		"correct":    correct,
		"message":    msg,
		"new_score":  player.Score,
		"real_value": realVal,
		"points_awarded": points,
	})
}

func GetLeaderboard(c *gin.Context) {
	top := storage.DB.GetTopPlayers(10)
	c.JSON(http.StatusOK, top)
}
