INSERT INTO users (id,name,email,password,role,created_at) VALUES
(1,'Admin','admin@medtracker.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi','ADMIN',CURRENT_TIMESTAMP),
(2,'Demo User','user@medtracker.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi','USER',CURRENT_TIMESTAMP);

INSERT INTO pharmacies (id,name,branch,address,phone,rating) VALUES
(1,'Apollo Pharmacy','Anna Nagar','15 Anna Nagar, Chennai','044-12345678',4.5),
(2,'Apollo Pharmacy','T Nagar','22 T Nagar, Chennai','044-87654321',4.3),
(3,'MedPlus','Velachery','8 Velachery Main Rd, Chennai','044-11223344',4.1),
(4,'Netmeds','Online','Online Delivery','1800-123-456',4.7);

INSERT INTO medicines (id,name,generic_name,category,price,manufacturer,description,requires_prescription) VALUES
(1,'Paracetamol 500mg','Acetaminophen','Analgesic',15.0,'Cipla','Pain and fever relief',false),
(2,'Amoxicillin 250mg','Amoxicillin','Antibiotic',45.0,'Sun Pharma','Broad spectrum antibiotic',true),
(3,'Metformin 500mg','Metformin HCl','Antidiabetic',30.0,'Dr Reddys','Type 2 diabetes management',true),
(4,'Atorvastatin 10mg','Atorvastatin','Statin',55.0,'Pfizer','Cholesterol management',true),
(5,'Omeprazole 20mg','Omeprazole','Antacid',25.0,'Cipla','Acid reflux treatment',false),
(6,'Cetirizine 10mg','Cetirizine HCl','Antihistamine',20.0,'GSK','Allergy relief',false),
(7,'Azithromycin 500mg','Azithromycin','Antibiotic',85.0,'Cipla','Bacterial infections',true),
(8,'Ibuprofen 400mg','Ibuprofen','NSAID',18.0,'Abbott','Pain and inflammation',false);

INSERT INTO pharmacy_medicines (pharmacy_id,medicine_id,stock,price) VALUES
(1,1,100,15.0),(1,2,50,45.0),(1,3,75,30.0),(1,5,60,25.0),
(2,1,80,14.0),(2,4,40,55.0),(2,6,90,20.0),(2,8,70,18.0),
(3,1,120,13.5),(3,2,30,44.0),(3,7,25,85.0),(3,3,55,29.0),
(4,1,200,12.0),(4,5,150,23.0),(4,6,180,19.0),(4,8,160,17.0);

INSERT INTO voice_commands (id,phrase,action,description,language) VALUES
(1,'dashboard sellavum','NAVIGATE:/dashboard','Go to Dashboard','ta-IN'),
(2,'marunthagam sellavum','NAVIGATE:/search-medicine','Search Medicine','ta-IN'),
(3,'marunthu kedaikum idangal','NAVIGATE:/find-medicine','Find Medicine','ta-IN'),
(4,'en orders','NAVIGATE:/my-orders','My Orders','ta-IN'),
(5,'profile','NAVIGATE:/profile','Profile','ta-IN');
