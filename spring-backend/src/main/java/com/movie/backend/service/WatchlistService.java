package com.movie.backend.service;

import com.movie.backend.entity.Watchlist;
import com.movie.backend.repository.WatchlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WatchlistService {
    private final WatchlistRepository watchlistRepository;

    public List<Watchlist> getUserWatchlist(Long userId) {
        return watchlistRepository.findByUserId(userId);
    }

    public Watchlist addToWatchlist(Watchlist watchlist) {
        return watchlistRepository.save(watchlist);
    }
}
