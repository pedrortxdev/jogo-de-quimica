package game

import (
	"fmt"
	"gamequimica-backend/models"
	"math"
	"math/rand"
	"time"

	"github.com/google/uuid"
)

type Compound struct {
	Name      string
	Formula   string
	MolarMass float64
}

var Compounds = []Compound{
	{"Cloreto de Sódio", "NaCl", 58.44},
	{"Ácido Sulfúrico", "H2SO4", 98.079},
	{"Hidróxido de Sódio", "NaOH", 39.997},
	{"Ácido Clorídrico", "HCl", 36.46},
	{"Glicose", "C6H12O6", 180.156},
	{"Permanganato de Potássio", "KMnO4", 158.03},
}

var ActiveQuestions = make(map[string]models.Question)

func GenerateQuestion() models.Question {
	rng := rand.New(rand.NewSource(time.Now().UnixNano()))
	qType := rng.Intn(3)
	comp := Compounds[rng.Intn(len(Compounds))]
	
	id := uuid.New().String()
	q := models.Question{
		ID:        id,
		Compound:  comp.Formula,
		MolarMass: comp.MolarMass,
		Points:    100,
		Tolerance: 0.05, // 5% tolerance
	}

	switch qType {
	case 0: // Molarity Calculation: M = m / (MM * V)
		// Given Mass and Volume, find Molarity
		volL := math.Round((0.1+rng.Float64()*1.9)*100) / 100 // 0.1 to 2.0 L
		molarity := math.Round((0.1+rng.Float64()*1.5)*100) / 100 // 0.1 to 1.6 M
		
		mass := molarity * comp.MolarMass * volL
		
		q.Type = "calculo_molaridade"
		q.Text = fmt.Sprintf("Calcule a massa (em gramas) de %s necessária para preparar %.2f L de uma solução %.2f M.", comp.Name, volL, molarity)
		q.TargetValue = mass
		q.Units = "g"

	case 1: // Concentration (g/L): C = m/V
		mass := float64(rng.Intn(100) + 10)
		volL := math.Round((0.25+rng.Float64())*100) / 100
		
		q.Type = "concentracao_gl"
		q.Text = fmt.Sprintf("Você dissolveu %.0f g de %s em água suficiente para fazer %.2f L de solução. Qual é a concentração em g/L?", mass, comp.Formula, volL)
		q.TargetValue = mass / volL
		q.Units = "g/L"

	case 2: // Dilution: C1*V1 = C2*V2 -> Find V1
		c2 := math.Round((0.1 + rng.Float64()*0.5)*100) / 100
		factor := float64(rng.Intn(4) + 2) // Dilution factor 2x to 5x
		c1 := c2 * factor
		v2 := float64((rng.Intn(5) + 1) * 100) // 100 to 500 ml
		
		q.Type = "diluicao"
		q.Text = fmt.Sprintf("Você precisa preparar %.0f mL de %s %.2f M a partir de uma solução estoque de %.2f M. Quantos mL da solução estoque você precisa?", v2, comp.Formula, c2, c1)
		q.TargetValue = (c2 * v2) / c1
		q.Units = "mL"
	}

	ActiveQuestions[id] = q
	return q
}

func CheckAnswer(req models.AnswerRequest) (bool, string, float64) {
	q, exists := ActiveQuestions[req.QuestionID]
	if !exists {
		return false, "Questão expirada ou inválida", 0
	}

	// Remove question after check to prevent replay
	delete(ActiveQuestions, req.QuestionID)

	diff := math.Abs(q.TargetValue - req.Value)
	allowedError := q.TargetValue * q.Tolerance

	if diff <= allowedError {
		return true, "Correto!", q.TargetValue
	}
	
	return false, fmt.Sprintf("Incorreto. A resposta exata era %.2f %s", q.TargetValue, q.Units), q.TargetValue
}
