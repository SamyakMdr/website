use school_management_system;

CREATE TABLE students (    
student_id INT PRIMARY KEY,
name VARCHAR(45) NOT NULL,    
age INT NOT NULL CHECK (age >= 0 AND age <= 99),
grade VARCHAR(10) NOT NULL,    
student_contact VARCHAR(15) NOT NULL,
student_address VARCHAR(100),
enrollment_date date not null
);
    
    
CREATE TABLE teachers (    
teacher_id INT PRIMARY KEY,
name VARCHAR(45) NOT NULL,    
subject varchar(15),
teacher_contact VARCHAR(15) NOT NULL,    
teacher_address VARCHAR(100),
salary int not null);


CREATE TABLE class(    
class_id INT PRIMARY KEY,
class_name VARCHAR(45) NOT NULL,    
grade varchar(15),
teacher_id int not null,    
FOREIGN KEY(teacher_id) REFERENCES teachers(teacher_id),
room_number int not null);


CREATE TABLE subject(    
subject_id INT PRIMARY KEY,
subject_name VARCHAR(15) NOT NULL,    
description varchar(80),
class_id int not null,    
FOREIGN KEY(class_id) REFERENCES class(class_id),
teacher_id int not null,    
FOREIGN KEY(teacher_id) REFERENCES teachers(teacher_id)
);


CREATE TABLE enrollment(    
enrollment_id INT PRIMARY KEY,
student_id int not null,    
FOREIGN KEY(student_id) REFERENCES students(student_id),
class_id int not null,    
FOREIGN KEY(class_id) REFERENCES class(class_id),
enrollment_date date
);


INSERT INTO students (student_id, name, age, grade, student_contact, student_address, enrollment_date) VALUES
(1, 'Ram Kumar', 7, '1st Grade', '9841234567', 'Thamel, Kathmandu', '2023-04-01'),
(2, 'Shyam Sharma', 8, '2nd Grade', '9841234568', 'Lazimpat, Kathmandu', '2023-05-01'),
(3, 'Hari Prasad', 9, '3rd Grade', '9841234569', 'Banasthali, Kathmandu', '2023-06-01'),
(4, 'Sita Devi', 10, '4th Grade', '9841234570', 'Patan, Lalitpur', '2023-07-01'),
(5, 'Gita Rani', 11, '5th Grade', '9841234571', 'Bhaktapur Durbar Square, Bhaktapur', '2023-08-01'),
(6, 'Mohan Adhikari', 12, '6th Grade', '9841234572', 'Kalimati, Kathmandu', '2023-09-01'),
(7, 'Preeti Koirala', 13, '7th Grade', '9841234573', 'Nepalgunj, Banke', '2023-10-01'),
(8, 'Ravi Joshi', 14, '8th Grade', '9841234574', 'Biratnagar, Morang', '2023-11-01'),
(9, 'Anita Sharma', 15, '9th Grade', '9841234575', 'Itahari, Sunsari', '2023-12-01'),
(10, 'Subash Bhandari', 16, '10th Grade', '9841234576', 'Kapan, Kathmandu', '2024-01-01'),
(11, 'Suman Bhattarai', 8, '2nd Grade', '9841234577', 'Pokhara, Kaski', '2023-05-15'),
(12, 'Kriti Dhakal', 9, '3rd Grade', '9841234578', 'Chitwan', '2023-06-15'),
(13, 'Ramesh Yadav', 10, '4th Grade', '9841234579', 'Hetauda, Makwanpur', '2023-07-15'),
(14, 'Nisha Rathi', 11, '5th Grade', '9841234580', 'Birtamode, Jhapa', '2023-08-15'),
(15, 'Prakash Thapa', 12, '6th Grade', '9841234581', 'Birgunj, Parsa', '2023-09-15'),
(16, 'Sunita Rana', 13, '7th Grade', '9841234582', 'Dharan, Sunsari', '2023-10-15'),
(17, 'Deepak Rai', 14, '8th Grade', '9841234583', 'Lalitpur', '2023-11-15'),
(18, 'Manisha Baral', 15, '9th Grade', '9841234584', 'Dang', '2023-12-15'),
(19, 'Rajesh Pandey', 16, '10th Grade', '9841234585', 'Nepalgunj, Banke', '2024-01-15'),
(20, 'Pooja Acharya', 7, '1st Grade', '9841234586', 'Bhairahawa, Rupandehi', '2023-04-15'),
(21, 'Sanjay Kumar', 8, '2nd Grade', '9841234587', 'Tansen, Palpa', '2023-05-15'),
(22, 'Renu Kumari', 9, '3rd Grade', '9841234588', 'Rajbiraj, Saptari', '2023-06-15'),
(23, 'Ashok Thakur', 10, '4th Grade', '9841234589', 'Biratnagar, Morang', '2023-07-15'),
(24, 'Sarita Devi', 11, '5th Grade', '9841234590', 'Lumbini', '2023-08-15'),
(25, 'Gopal Giri', 12, '6th Grade', '9841234591', 'Birgunj, Parsa', '2023-09-15');



INSERT INTO teachers (teacher_id, name, subject, teacher_contact, teacher_address, salary) VALUES(1, 'Sita Rana', 'Mathematics', '9845678901', 'Thamel, Kathmandu', 50000),
(2, 'Ram Sharma', 'Science', '9845678902', 'Lazimpat, Kathmandu', 55000),(3, 'Geeta Patel', 'English', '9845678903', 'Patan, Lalitpur', 60000),
(4, 'Shyam Joshi', 'Social Studies', '9845678904', 'Bhaktapur, Bhaktapur', 52000),(5, 'Anita Baral', 'Nepali', '9845678905', 'Nepalgunj, Banke', 53000),
(6, 'Mohan Adhikari', 'Physics', '9845678906', 'Pokhara, Kaski', 58000),(7, 'Kriti Dhakal', 'Chemistry', '9845678907', 'Biratnagar, Morang', 59000),
(8, 'Rajesh Thapa', 'Biology', '9845678908', 'Hetauda, Makwanpur', 57000),(9, 'Pooja Acharya', 'Computer Science', '9845678909', 'Itahari, Sunsari', 62000),
(10, 'Sunita Kumari', 'Economics', '9845678910', 'Kapan, Kathmandu', 54000),(11, 'Ramesh Yadav', 'Geography', '9845678911', 'Dharan, Sunsari', 56000),
(12, 'Nisha Rathi', 'History', '9845678912', 'Rajbiraj, Saptari', 51000),(13, 'Sanjay Kumar', 'Mathematics', '9845678913', 'Bhairahawa, Rupandehi', 50000),
(14, 'Renu Kumari', 'Science', '9845678914', 'Lumbini', 55000),(15, 'Ashok Thakur', 'English', '9845678915', 'Birgunj, Parsa', 60000),
(16, 'Sarita Devi', 'Social Studies', '9845678916', 'Chitwan', 52000),(17, 'Deepak Rai', 'Nepali', '9845678917', 'Lalitpur', 53000),
(18, 'Manisha Baral', 'Physics', '9845678918', 'Tansen, Palpa', 58000),(19, 'Gopal Giri', 'Chemistry', '9845678919', 'Birtamode, Jhapa', 59000),
(20, 'Ravi Joshi', 'Biology', '9845678920', 'Biratnagar, Morang', 57000);


INSERT INTO class (class_id, class_name, grade, teacher_id, room_number) VALUES(1, 'Mathematics 101', '1st Grade', 1, 101),
(2, 'Science 101', '2nd Grade', 2, 102),(3, 'English 101', '3rd Grade', 3, 103),
(4, 'Social Studies 101', '4th Grade', 4, 104),(5, 'Nepali 101', '5th Grade', 5, 105),
(6, 'Physics 101', '6th Grade', 6, 106),(7, 'Chemistry 101', '7th Grade', 7, 107),
(8, 'Biology 101', '8th Grade', 8, 108),(9, 'Computer Science 101', '9th Grade', 9, 109),
(10, 'Economics 101', '10th Grade', 10, 110);


INSERT INTO subject (subject_id, subject_name, description, class_id, teacher_id) VALUES(1, 'Mathematics', 'Basic arithmetic and geometry.', 1, 1),
(2, 'Science', 'Introduction to natural sciences.', 2, 2),(3, 'English', 'English language and literature basics.', 3, 3),
(4, 'Social Studies', 'History and social sciences overview.', 4, 4),(5, 'Nepali', 'Nepali language and literature.', 5, 5),
(6, 'Physics', 'Fundamentals of physics and mechanics.', 6, 6),(7, 'Chemistry', 'Basic principles of chemistry and reactions.', 7, 7),
(8, 'Biology', 'Introduction to biological sciences and ecology.', 8, 8),(9, 'Computer Science', 'Introduction to programming and IT concepts.', 9, 9),
(10, 'Economics', 'Basics of economics and financial principles.', 10, 10);


INSERT INTO enrollment (enrollment_id, student_id, class_id, enrollment_date) VALUES(1, 1, 1, '2023-04-01'),
(2, 2, 2, '2023-05-01'),(3, 3, 3, '2023-06-01'),
(4, 4, 4, '2023-07-01'),(5, 5, 5, '2023-08-01'),
(6, 6, 6, '2023-09-01'),(7, 7, 7, '2023-10-01'),
(8, 8, 8, '2023-11-01'),(9, 9, 9, '2023-12-01'),
(10, 10, 10, '2024-01-01'),(11, 11, 5, '2023-05-15'),
(12, 12, 6, '2023-06-15'),(13, 13, 4, '2023-07-15'),
(14, 14, 5, '2023-08-15'),(15, 15, 6, '2023-09-15'),
(16, 16, 7, '2023-10-15'),(17, 17, 8, '2023-11-15'),
(18, 18, 9, '2023-12-15'),
(19, 19, 10, '2024-01-15'),
(20, 20, 1, '2023-04-15'),(21, 21, 2, '2023-05-15'),
(22, 22, 3, '2023-06-15'),(23, 23, 4, '2023-07-15'),
(24, 24, 5, '2023-08-15'),(25, 25, 6, '2023-09-15');
