package com.example.digitalcafe.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import java.io.File;
import java.io.IOException;

@RestController
@CrossOrigin("*")
public class UploadController {

    @Value("${upload.dir}")
    private String uploadDir;

    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file) throws IOException {

        File dir = new File(uploadDir);

        System.out.println("UPLOAD DIR: " + dir.getAbsolutePath());

        if (!dir.exists()) dir.mkdirs();

        String fileName =
                System.currentTimeMillis() + "_" +
                        file.getOriginalFilename();

        File destination = new File(dir, fileName);

        file.transferTo(destination);

        System.out.println("SAVED FILE: " + destination.getAbsolutePath());

        return fileName;
    }
}