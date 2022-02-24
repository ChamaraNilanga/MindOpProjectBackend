CREATE DARABASE LMS;

--\c into LMS


 create table User_
   (
   UserId varchar(10),
   UserName varchar(50),
   Gender varchar(10),
   DOB date,
   Email varchar(30),
   Pass_word varchar(30),
   Home_no varchar(30),
   Lane varchar(30),
   City varchar(30),
   ContactNo int,
   Teacher bit,
   Admin_  bit,
   Student  bit,
   primary key(UserId));
   ----------------------
   create table Student
   (
   StudentId varchar(10),
   guardianName varchar(50),
   guardianTP int,
   primary key(StudentId),
   foreign key(StudentId) references User_(UserID));

   ------------------------
    create table Notification_
   (
   NotificationID SERIAL,
   NotificationBody varchar(500),
   primary key(NotificationID));

   ---------------------------
   create table NotificationReceived
   (
   NotificationID SERIAL,
   StudentId varchar(10),
   receivedTime TIME,
   primary key(NotificationID,StudentId),
   foreign key(StudentId) references Student(StudentId),
   foreign key(NotificationID) references Notification_(NotificationID));

   -----------------------------
   create table Teacher
   (
   TeacherID varchar(10),
   ServiceDuration int,
   TeachingDepartment varchar(50),
   receivedPayment money,
   primary key(TeacherID),
   foreign key(TeacherID) references User_(UserID));

   -----------------------------
   create table Admin_
   (
   AdminID varchar(10),
   ServiceDuration int,
   primary key(AdminID),
   foreign key(AdminID) references User_(UserID));

   ------------------------------
   create table Wishlist
   (
   WishListid SERIAL,
   Adddate date,
   UserID varchar(10),
   primary key(WishListid),
   foreign key(UserID) references User_(UserID));

   -------------------------------
   create table Login_
   (
   RecordID varchar(10),
   UserID varchar(10),
   LoginTime datetime,
   primary key(RecordID),
   foreign key(UserID) references User_(UserID));

   ------------------------------
   create table Message_
   (
   MessageId SERIAL,
   MessageBody varchar(500),
   sender varchar(10),
   primary key(MessageId));

   ------------------------------
   create table Qualification
   (
   UserID varchar(10),
   Qualification varchar(50),
   primary key(UserID,Qualification),
   foreign key(UserID) references Teacher(TeacherID));

   ------------------------------
   create table Blog
   (
   BlogID SERIAL,
   BlogTitle varchar(50),
   Body text,
   UserID varchar(10),
   ManageTime time,
   primary key(BlogID),
   foreign key(UserID) references User_(UserID));

   --------------------------------
   create table Blog_comment
   (
   BcommentID SERIAL,
   CommentBody text,
   BlogID  SERIAL,
   BloggerID varchar(10),
   PostedTime time,
   primary key(BcommentID),
   foreign key(BlogID) references Blog(BlogID),
   foreign key(BloggerID) references Student(StudentID));

   ---------------------------------
   create table Forum_category
   (
   FCategoryID SERIAL,
   name_  varchar(50),
   primary key(FCategoryID));

   ---------------------------------
   create table Forum_question
   (
   FQuestionID SERIAL,
   name_  varchar(50),
   FCategoryID  SERIAL,
   ManageTime time,
   UserID  varchar(10),
   PinStatus Boolean,
   LockStatus Boolean,
   primary key(FQuestionID),
   foreign key(FCategoryID) references Forum_category(FCategoryID),
   foreign key(UserID) references User_(UserID));

   ---------------------------------
   create table Forum_Comment
   (
   FCommentID SERIAL,
   Body  text,
   PostedTime TIMESTAMP,
   FQuestionID SERIAL,
   CommenterID VARCHAR(10),
   primary key(FCommentID),
   foreign key(FQuestionID) references Forum_question(FQuestionID),
   foreign key(CommenterID) references User_(UserID));

   ---------------------------------
   create table Forum_sub_comment
   (
   FsubCommentID SERIAL,
   Body  text,
   FCommentID  SERIAL,
   PostedTime TIMESTAMP,
   subcomID varchar(10),
   primary key(FsubCommentID),
   foreign key(FCommentID) references Forum_Comment(FCommentID),
   foreign key(subcomID) references User_(UserID));

   -----------------------------------
   create table Module
   (
   ModID SERIAL,
   ModName varchar(50),
   Descrip varchar(100),
   SDate  date,
   EndDate date,
   TeacherID varchar(10),
   AdminID varchar(10),
   CreatedTime timestamp,
   ModCode varchar(10),
   primary key(ModID),
   foreign key(TeacherID) references Teacher(TeacherID),
   foreign key(AdminID) references Admin_(AdminID));

   ------------------------------------
   create table WishlistBelong
   (
   WishListID SERIAL,
   ModuleID  SERIAL,
   primary key(WishListID,ModuleID),
   foreign key(WishListID) references Wishlist(WishListid),
   foreign key(ModuleID) references Module(ModID));

   --------------------------------------
   create table chat
   (
   StudentID varchar(10),
   TeacherID varchar(10),
   ChatTime  timestamp,
   MessageId  SERIAL,
   primary key(StudentID,TeacherID),
   foreign key(MessageId) references Message_(MessageId),
   foreign key(TeacherID) references Teacher(TeacherID));

   --------------------------------------
   create table EnrollmentRequest
   (
   requestedID SERIAL,
   TeacherID varchar(10),
   acceptTime  timestamp,
   ModuleID  SERIAL,
   StudentID  varchar(10),
   RequestedTime timestamp,
   Progress float,
   primary key(requestedID),
   foreign key(TeacherID) references Teacher(TeacherID),
   foreign key(ModuleID) references Module(ModID),
   foreign key(StudentID) references Student(StudentID));

   ---------------------------------------
   create table Type_
   (
   typeID SERIAL,
   type_ varchar(20),
   format_  varchar(20),
   primary key(typeID));

   --------------------------------------
   create table Content
   (
   contentID SERIAL,
   typeID SERIAL,
   uploadtime  timestamp,
   ModuleID  SERIAL,
   primary key(contentID),
   foreign key(typeID) references Type_(typeID),
   foreign key(ModuleID) references Module(ModID));

   ---------------------------------------
   create table Assignment
   (
   AssignmentID SERIAL,
   DueDate  timestamp,
   submission  text,
   CreateTime timestamp,
   Introduction text,
   name_ varchar(100),
   ContentID  SERIAL,
   primary key(AssignmentID),
   foreign key(ContentID) references Content(contentID));

   ---------------------------------------
   create table AssignmentAttempt
   (
   AssignmentID SERIAL,
   StudentID varchar(10),
   AttemptTime  timestamp,
   Grade varchar(10),
   primary key(AssignmentID,StudentID),
   foreign key(AssignmentID) references Assignment(AssignmentID),
   foreign key(StudentID) references Student(StudentID));

   ---------------------------------------
   create table Quiz
   (
   QuizID VARCHAR(10),
   Description_ text,
   TimeLimit time,
   ContentID SERIAL,
   primary key(QuizID),
   foreign key(ContentID) references Content(contentID));

   --------------------------------------
   create table QuizAttempt
   (
   QuizID varchar(10),
   StudentID varchar(10),
   AttemptTime time,
   primary key(QuizID,StudentID),
   foreign key(StudentID) references Student(StudentID));

   ------------------------------------
   create table QuestionSubCategory
   (
   QuestionSubCategoryID SERIAL,
   SubCatName varchar(50),
   primary key(QuestionSubCategoryID));

   -----------------------------------
   create table QuestionCategory
   (
   CategoryID SERIAL,
   CategoryName VARCHAR(50),
   SubCategoryID SERIAL,
   primary key(CategoryID),
   foreign key(SubCategoryID) references QuestionSubCategory(QuestionSubCategoryID));

   ---------------------------------
   create table QuizQuestion
   (
   QID SERIAL,
   mark varchar(10),
   createdDate date,
   QuestionName varchar(100),
   LastModifiedDate date,
   QuestionText text,
   QuestionCategoryID SERIAL,
   TeacherID varchar(10),
   CreatedTime timestamp,
   type_ varchar(50),
   primary key(QID),
   foreign key(TeacherID) references Teacher(TeacherID),
   foreign key(QuestionCategoryID) references QuestionCategory(CategoryID));

   ---------------------------------
   create table QuizHasQuizQuestion
   (
   QuizID varchar(10),
   QID SERIAL,
   primary key(QuizID,QID),
   foreign key(QuizID) references Quiz(QuizID),
   foreign key(QID) references QuizQuestion(QID));

   --------------------------------
   create table CorrectAnswer
   (
   QID SERIAL,
   CorrectAnswer varchar(10),
   primary key(QID,CorrectAnswer),
   foreign key(QID) references QuizQuestion(QID));

   --------------------------------
   create table StudentAnswer
   (
   StudentID varchar(10),
   QID SERIAL,
   GivenAnswer varchar(10),
   primary key(StudentID,QID),
   foreign key(QID) references QuizQuestion(QID),
   foreign key(StudentID) references Student(StudentID));

   --------------------------------
   create table Tag
   (
   QID SERIAL,
   Tag varchar(20),
   primary key(QID,Tag),
   foreign key(QID) references QuizQuestion(QID));

   --------------------------------
   create table Payment
   (
   PaymentID SERIAL,
   Amount REAL,
   ModuleID SERIAL,
   StudentID varchar(10),
   PaidTime timestamp,
   primary key(PaymentID),
   foreign key(ModuleID) references Module(ModID),
   foreign key(StudentID) references Student(StudentID));