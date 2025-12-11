package storage

import (
	"encoding/json"
	"gamequimica-backend/models"
	"os"
	"sort"
	"sync"
)

const dbFile = "leaderboard.json"

type Store struct {
	sync.RWMutex
	Players map[string]*models.Player
}

var DB *Store

func InitDB() {
	DB = &Store{
		Players: make(map[string]*models.Player),
	}
	DB.Load()
}

func (s *Store) Load() {
	s.Lock()
	defer s.Unlock()

	file, err := os.ReadFile(dbFile)
	if err != nil {
		if os.IsNotExist(err) {
			return
		}
		panic(err)
	}

	var data []models.Player
	if err := json.Unmarshal(file, &data); err != nil {
		return
	}

	for _, p := range data {
		np := p
		s.Players[p.ID] = &np
	}
}

func (s *Store) Save() {
	s.Lock()
	defer s.Unlock()

	var data []models.Player
	for _, p := range s.Players {
		data = append(data, *p)
	}

	// Sort by highscore desc
	sort.Slice(data, func(i, j int) bool {
		return data[i].Highscore > data[j].Highscore
	})

	bytes, _ := json.MarshalIndent(data, "", "  ")
	_ = os.WriteFile(dbFile, bytes, 0644)
}

func (s *Store) GetTopPlayers(limit int) []models.Player {
	s.RLock()
	defer s.RUnlock()

	var data []models.Player
	for _, p := range s.Players {
		data = append(data, *p)
	}

	sort.Slice(data, func(i, j int) bool {
		return data[i].Highscore > data[j].Highscore
	})

	if len(data) > limit {
		return data[:limit]
	}
	return data
}

func (s *Store) UpsertPlayer(p *models.Player) {
	s.Lock()
	existing, exists := s.Players[p.ID]
	if exists {
		// Update persistent fields if needed
		// For now we trust the incoming state or just update scores
		if p.Score > existing.Highscore {
			existing.Highscore = p.Score
		}
		existing.Score = p.Score
	} else {
		s.Players[p.ID] = p
	}
	s.Unlock()
	s.Save()
}
