package com.example.digitalcafe.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name="menu")
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name="cafe_id")
    private Integer cafeId;
    private String name;
    private String category;

    @Column(length=1000)
    private String description;

    private Double price;

    /* 🔥 MULTIPLE IMAGES SUPPORT */
    @ElementCollection
    @CollectionTable(name="menu_images", joinColumns=@JoinColumn(name="menu_id"))
    @Column(name="image_name")
    private List<String> images;

    private String status = "ACTIVE";

    public Menu(){}

    public Integer getId(){ return id; }
    public void setId(Integer id){ this.id=id; }

    public Integer getCafeId(){ return cafeId; }
    public void setCafeId(Integer cafeId){ this.cafeId=cafeId; }

    public String getName(){ return name; }
    public void setName(String name){ this.name=name; }

    public String getCategory(){ return category; }
    public void setCategory(String category){ this.category=category; }

    public String getDescription(){ return description; }
    public void setDescription(String description){ this.description=description; }

    public Double getPrice(){ return price; }
    public void setPrice(Double price){ this.price=price; }

    public List<String> getImages(){ return images; }
    public void setImages(List<String> images){ this.images=images; }

    public String getStatus(){ return status; }
    public void setStatus(String status){ this.status=status; }
}