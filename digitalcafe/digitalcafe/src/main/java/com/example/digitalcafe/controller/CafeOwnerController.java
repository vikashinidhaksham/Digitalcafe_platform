package com.example.digitalcafe.controller;
import com.example.digitalcafe.entity.User;
import com.example.digitalcafe.entity.Menu;
import com.example.digitalcafe.entity.Cafe;
import com.example.digitalcafe.repository.UserRepository;
import com.example.digitalcafe.repository.CafeRepository;
import com.example.digitalcafe.repository.MenuRepository;
import com.example.digitalcafe.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/owner")
@CrossOrigin(origins = "*")   // allow Angular
public class CafeOwnerController {
    private final String UPLOAD_DIR = "C:\\Users\\Dell\\Digital-Cafe-Ordering-and-Operations-Platform_Feb_Batch-8_2026\\cms_group2\\digitalcafe\\digitalcafe\\uploads\\";
    @Autowired
    private UserRepository userRepo;

    @Autowired
    private CafeRepository cafeRepo;

    @Autowired
    private MenuRepository menuRepo;

    @Autowired
    private AuthService auth;

    /* =====================================================
                      CAFE SECTION
       ===================================================== */



    // GET OWNER CAFES
    @GetMapping("/cafes/{ownerId}")
    public List<Cafe> getOwnerCafes(@PathVariable Integer ownerId){
        return cafeRepo.findByOwnerId(ownerId);
    }


    /* =====================================================
                      MENU SECTION
       ===================================================== */

    // ⭐ ADD MENU  (THIS WAS YOUR MAIN ISSUE)
    @PostMapping("/menu/{cafeId}")
    public Menu addMenu(@PathVariable Integer cafeId,
                        @RequestBody Menu m){

        m.setCafeId(cafeId);
        return menuRepo.save(m);
    }

    // GET MENU BY CAFE
    @GetMapping("/menu/{cafeId}")
    public List<Menu> getMenu(@PathVariable Integer cafeId){
        return menuRepo.findByCafeId(cafeId);
    }

    // UPDATE STATUS (ACTIVE / INACTIVE)
    @PutMapping("/menu/status")
    public Menu updateMenu(@RequestBody Menu m){
        return menuRepo.save(m);
    }

    @DeleteMapping("/menu/{id}")
    public void deleteMenu(@PathVariable Integer id){
        menuRepo.deleteById(id);
    }

    @PutMapping("/menu/{id}")
    public Menu updateFullMenu(@PathVariable Integer id,
                               @RequestBody Menu updatedMenu) {

        Menu existingMenu = menuRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu not found"));

        existingMenu.setName(updatedMenu.getName());
        existingMenu.setCategory(updatedMenu.getCategory());
        existingMenu.setDescription(updatedMenu.getDescription());
        existingMenu.setPrice(updatedMenu.getPrice());
        existingMenu.setStatus(updatedMenu.getStatus());
        existingMenu.setImages(updatedMenu.getImages());

        return menuRepo.save(existingMenu);
    }

    /* =====================================================
                      STAFF SECTION
       ===================================================== */

    @PostMapping("/staff/cafe/{cafeId}")
    public User addStaff(@PathVariable Integer cafeId,
                         @RequestBody User user) {

        user.setCafeId(cafeId);
        user.setStatus("ACTIVE");

        // set default password
        user.setPassword("123456");

        return userRepo.save(user);
    }
    @GetMapping("/count")
    public Long getCafeCount(){
        return cafeRepo.count();
    }
    // GET STAFF BY CAFE
    @GetMapping("/staff/cafe/{cafeId}")
    public List<User> getStaff(@PathVariable Integer cafeId){
        return userRepo.findByCafeId(cafeId);
    }
    @PutMapping("/staff/{id}")
    public User updateStaff(@PathVariable Integer id,
                            @RequestBody User updatedUser) {

        User existingUser = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setPhone(updatedUser.getPhone());
        existingUser.setRole(updatedUser.getRole());
       // existingUser.setPassword(updatedUser.getPassword());
        existingUser.setPhoto(updatedUser.getPhoto());

        existingUser.setPersonalDetails(updatedUser.getPersonalDetails());
        existingUser.setAddressDetails(updatedUser.getAddressDetails());
        existingUser.setEducationDetails(updatedUser.getEducationDetails());
        existingUser.setWorkDetails(updatedUser.getWorkDetails());
        existingUser.setDocumentDetails(updatedUser.getDocumentDetails());

        return userRepo.save(existingUser);
    }
    @DeleteMapping("/staff/{id}")
    public String deleteStaff(@PathVariable Integer id){

        if(!userRepo.existsById(id)){
            throw new RuntimeException("Staff not found");
        }

        userRepo.deleteById(id);
        return "Staff deleted successfully";
    }
    @DeleteMapping("/cafes/{id}")
    public void deleteCafe(@PathVariable Integer id) {
        cafeRepo.deleteById(id);
    }

    @PostMapping("/cafes/{ownerId}")
    public Cafe createOrUpdateCafe(
            @PathVariable Integer ownerId,
            @RequestParam("name") String name,
            @RequestParam("tagline") String tagline,
            @RequestParam("description") String description,
            @RequestParam("openTime") String openTime,
            @RequestParam("closeTime") String closeTime,
            @RequestParam("phone") String phone,
            @RequestParam("email") String email,
            @RequestParam("streetNo") String streetNo,
            @RequestParam("streetName") String streetName,
            @RequestParam("landmark") String landmark,
            @RequestParam("state") String state,
            @RequestParam("country") String country,
            @RequestParam("pincode") String pincode,
            @RequestParam("fssai") String fssai,
            @RequestParam("gst") String gst,
            @RequestParam("tradeLicense") String tradeLicense,
            @RequestParam("accountName") String accountName,
            @RequestParam("bankName") String bankName,
            @RequestParam("accountNumber") String accountNumber,
            @RequestParam("ifsc") String ifsc,
            @RequestParam("status") String status,

            // 🔥 ADD THIS
            @RequestParam(value = "proof", required = false) String proof,

            @RequestParam(value = "files", required = false) List<MultipartFile> files
    ) {

        try {

            Cafe cafe = new Cafe();

            cafe.setOwnerId(ownerId);
            cafe.setName(name);
            cafe.setTagline(tagline);
            cafe.setDescription(description);
            cafe.setOpenTime(openTime);
            cafe.setCloseTime(closeTime);
            cafe.setPhone(phone);
            cafe.setEmail(email);
            cafe.setStreetNo(streetNo);
            cafe.setStreetName(streetName);
            cafe.setLandmark(landmark);
            cafe.setState(state);
            cafe.setCountry(country);
            cafe.setPincode(pincode);
            cafe.setFssai(fssai);
            cafe.setGst(gst);
            cafe.setTradeLicense(tradeLicense);
            cafe.setAccountName(accountName);
            cafe.setBankName(bankName);
            cafe.setAccountNumber(accountNumber);
            cafe.setIfsc(ifsc);
            cafe.setStatus("APPROVED");
            cafe.setProof(proof);

            // ===== MULTIPLE IMAGE SAVE =====

            List<String> imageNames = new ArrayList<>();

// 🔥 KEEP OLD IMAGES
            if (cafe.getPhotos() != null) {
                imageNames = new ObjectMapper().readValue(cafe.getPhotos(), List.class);
            }

            if (files != null) {
                for (MultipartFile file : files) {

                    if (file.isEmpty()) continue;

                    String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

                    File uploadDir = new File(UPLOAD_DIR);
                    if (!uploadDir.exists()) {
                        uploadDir.mkdirs();
                    }

                    file.transferTo(new File(UPLOAD_DIR + fileName));
                    imageNames.add(fileName);
                }
            }

            ObjectMapper mapper = new ObjectMapper();
            cafe.setPhotos(mapper.writeValueAsString(imageNames));

            return cafeRepo.save(cafe);

        } catch (Exception e) {
            throw new RuntimeException("Error saving cafe: " + e.getMessage());
        }
    }
    @PutMapping("/cafes/{id}")
    public Cafe updateCafe(
            @PathVariable Integer id,
            @RequestParam("name") String name,
            @RequestParam("tagline") String tagline,
            @RequestParam("description") String description,
            @RequestParam("phone") String phone,
            @RequestParam("email") String email,
            @RequestParam(value = "proof", required = false) String proof,
            @RequestParam(value = "files", required = false) List<MultipartFile> files
    ) {

        try {

            Cafe cafe = cafeRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Cafe not found"));

            cafe.setName(name);
            cafe.setTagline(tagline);
            cafe.setDescription(description);
            cafe.setPhone(phone);
            cafe.setEmail(email);

            if (proof != null && !proof.isEmpty()) {
                cafe.setProof(proof);
            }

            ObjectMapper mapper = new ObjectMapper();
            List<String> imageNames = new ArrayList<>();

            // ✅ KEEP OLD IMAGES
            if (cafe.getPhotos() != null) {
                imageNames = mapper.readValue(cafe.getPhotos(), List.class);
            }

            // ✅ ADD NEW IMAGES
            if (files != null) {
                for (MultipartFile file : files) {

                    if (file.isEmpty()) continue;

                    String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

                    File uploadDir = new File(UPLOAD_DIR);
                    if (!uploadDir.exists()) {
                        uploadDir.mkdirs();
                    }

                    File dest = new File(UPLOAD_DIR + fileName);
                    file.transferTo(dest);

                    imageNames.add(fileName);
                }
            }

            cafe.setPhotos(mapper.writeValueAsString(imageNames));

            return cafeRepo.save(cafe);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error updating cafe: " + e.getMessage());
        }
    }

}