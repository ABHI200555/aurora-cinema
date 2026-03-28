package com.movie.backend.controller;

import com.movie.backend.entity.Watchlist;
import com.movie.backend.service.WatchlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/watchlist")
@RequiredArgsConstructor
public class WatchlistController {
    private final WatchlistService watchlistService;

    @GetMapping("/{userId}")
    public List<Watchlist> getUserWatchlist(@PathVariable Long userId) {
        return watchlistService.getUserWatchlist(userId);
    }

    @PostMapping
    public Watchlist addToWatchlist(@RequestBody Watchlist watchlist) {
        return watchlistService.addToWatchlist(watchlist);
    }
}
