package com.movie.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "movies")
@Data
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private Integer year;
    private Double rating;
    private String duration;
    private String genre;
    private String language;
    private String platform;
    private String image;
    private String backdrop;
    private String director;
    
    @Column(columnDefinition = "TEXT")
    private String synopsis;
    
    private String trailerKey;
    
    @Column(columnDefinition = "JSON")
    private String cast;
}
