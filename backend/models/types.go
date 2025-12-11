package models

type Player struct {
	ID        string `json:"id"`
	Username  string `json:"username"`
	Score     int    `json:"score"`
	Streak    int    `json:"streak"`
	Highscore int    `json:"highscore"`
}

type Question struct {
	ID            string   `json:"id"`
	Type          string   `json:"type"` // "molarity", "dilution", "concentration"
	Text          string   `json:"text"`
	Compound      string   `json:"compound"`
	MolarMass     float64  `json:"molar_mass,omitempty"`
	TargetValue   float64  `json:"-"` // The answer (hidden from JSON)
	Units         string   `json:"units"`
	Options       []string `json:"options,omitempty"` // For multiple choice if needed, but we'll use direct input
	Tolerance     float64  `json:"-"` // Acceptable margin of error (e.g., 5%)
	Points        int      `json:"points"`
}

type AnswerRequest struct {
	PlayerID   string  `json:"player_id"`
	QuestionID string  `json:"question_id"`
	Value      float64 `json:"value"`
}

type AnswerResponse struct {
	Correct   bool   `json:"correct"`
	NewScore  int    `json:"new_score"`
	Message   string `json:"message"`
	RealValue string `json:"real_value"`
}
