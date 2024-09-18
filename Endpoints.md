# Start All URLs With this
    http://localhost:5002/api     then /YOUR_Wanted_below_URL
# Doctor 
    Doctor Registration
    URL: /doctor-reg
    Usage: Endpoint for doctor registration.
    Input: Doctor registration details(name,Email_ID,password(minimum 8 letter with special characters)....).
    Output: returns Doctor details,success(true).

    Doctor Login
    URL: /doctor-login
    Usage: Endpoint for doctor login.
    Input: Doctor Email_ID,password .
    Output: returns success(true/false),
            token,
            Corresponding details of Doctor.

    Doctor Dashboard
    URL: /doctor-dashboard
    Usage: Endpoint for accessing the doctor dashboard.
    Input: Doctor Email,
           Token generated after login.
    Output: returns success(true/false),
            token success(True/false),
            StartupRetrievalsuccess(true/false),
            Available startupdetails in that district
# Drug Inspector
    DrugInspector Registration
    URL: /drugInspector-reg
    Usage: Endpoint for DrugInspector registration.
    Input:Startup details(name,Email_ID,password(minimum 8 letter with special characters),....)
    Output:DrugInspector data,Success(True/False)

    DrugInspector Login
    URL: /drugInspector-login
    Usage: Endpoint for DrugInspector login.
    Input: DrugInspector Email_ID,password .
    Output: returns success(true/false) ,
            token,
            Corresponding details of DrugInspector ,

    DrugInspector Dashboard
    URL: /drugInspector-dashboard
    Usage: Endpoint for accessing the startup drugInspector dashboard.
    Input: drugInspector Email_ID ,
           token generated after login.
    Output: returns success(true/false),
            Tokensuccess(True/False),
            StartupRetrievalsuccess(True/False),
            Available Doctordetails in that district
    
# Licensing Authority
    Licensing Authority Registration
    URL: /licensingAuthority-reg
    usage: End point for Licensing Authority registration
    Input: Licensing Authority details(name,Email_ID,password(minimum 8 letter with special characters).....)
    Output: Success(true/false),
            return Licensing Authority details.

    Licensing Authority Login
    URL: /authority-login
    Usage: Endpoint forLicensing Authority login.
    Input: Licensing Authority Email_ID,password .
    Output: returns success(true/false) ,
            token,
            Corresponding details of Licensing Authority ,

    Licensing Authority Dashboard
    URL: /licensingAuthority-dashboard
    Usage: Endpoint for accessing the licensing Authority dashboard.
    Input: Licensing Authority Email,
          token generated after login
    Output: returns success(true/false),
            Token success(true/false),
            StartupRetrievalsuccess(true/false),
            Available startupdetails in that district

    Licensing Authority Notification Post
    URL: /LA-Notificationpost
    Usage: Endpoint for Licensing Authorities to post notifications.
    Input:  Startup_Email, NotificationMsgData, Startup_Company.
    Output: returns,success message, Notification data(StartupEmail,LA_Email,message) ,Success(true/false)


    Licensing Authority Notification Sending Startups
    URL: /LA-NotificationSendingStartups
    Usage: Endpoint for Licensing Authorities to send notifications to startups.
    Input:Licensing Authority Email
    Output:returns list of StartUp(email,company names),Success(true,false)

    Licensing Authority Notification Get
    URL: /LA-NotificationGet
    Usage: Endpoint for Licensing Authorities to fetch notifications.
    Input:LA_Email,Startup_Email
    Output: notification message for that startup,Success(True/False)

# Farmer
    Farmer Registration
    URL: /farmer-reg
    Usage: Endpoint for farmer registration.
    Input:Farmer details(name,phone_number,password(minimum 8 letter with special characters).....)
    Output:farmer data,Success(True/False).

    Farmer Login
    URL: /farmer-login
    Usage: Endpoint for farmer login.
    Input: Farmer Phone_number,password .
    Output: returns success(true/false),
            token,
            Corresponding details of Farmer ,

    Farmer Dashboard
    URL: /farmer-dashboard  rename to /startups-at-farmersdistrict
    Usage: Endpoint for accessing the farmer dashboard.
    Input: Farmer Phone Number.
    Output: returns success(true/false),
            Tokensuccess(True/False),
            StartupRetrievalsuccess(True/False),
            Available startupdetails in that district


# Startup
    Startup Registration
    URL: /startup-reg
    Usage: Endpoint for startup registration.
    Input:Startup details(name,Email_ID,password(minimum 8 letter with special characters),company_name,....)
    Output:Startup data,Success(True/False)

    Startup Login
    URL: /startup-login
    Usage: Endpoint for startup login.
    Input: Startup Email_ID,password .
    Output: returns success(true/false) ,
            token,
            Corresponding details of Startup ,


    Fill Application In Startup Dashboard 
    URL: /startup-dashboard  
    Usage: Endpoint for passig data to fillig up application.
    Input: Startup Dash_details like GST no,PAN no.... and two pdf's  .
    Output: returns 1. Startup-Dash_details-details,
                     2.success(true/false)

    Retrieving Startup Dashboard Data 
    URL: /startup-dashboard  
    Usage: Endpoint for passig data to fillig up application.
    Input: Startup Dash_details like GST no,PAN no.... and two pdf's  .
    Output: returns 1. Startup-Dash_details-details,
                     2.success(true/false)

    Startup Farmer Dashboard
    URL: /farmertab-in-startup (renamed)
    Usage: Endpoint for accessing the startup farmer dashboard.
    Input: Startup email id.
    Output: returns Tokensuccess(True/False),
            FarmerRetrievalsuccess(True/False),
            Available-Farmerdetails in that district
    

    Startup Dashboard Doctortab
    URL: /doctertab-in-startup
    Usage: Endpoint for accessing the startup doctor dashboard.
    Input: Startup district .
    Output: returns success(true/false),
            Tokensuccess(True/False),
            DoctorRetrievalsuccess(True/False),
            Available Doctordetails in that district

    Startup Feedback Post
    URL: /StartupFeedback-post
    Usage: Endpoint for submitting startup feedback.
    Input: Startup Email,Feedback .
    Output: returns Corrsponding Startup Dash_Details,success(true/false) .

    Startup Feedback Get
    URL: /StartupFeedback-get
    Usage: Endpoint for retrieving startup feedback.
    Input: Startup Email_ID .
    Output: returns Corresponding Startup Feedback,success(true/false).

    StratupBasic
    URL: /startup-basic
    Usage: Endpoint to retrieval of Startup Data
    Input: Startup Email
    Output: Success(true/false),
        Corresponding Startup Data.

# Email sending
    URL: /send-email
    Usage: Endpoint for sending emails.
    Input: Email_ID(receiver) ,message.
    Output: returns message(Email successfully sent),success(true/false)


# Fetch Districts
    URL: /districts
    Usage: Endpoint for fetching district information.
    Input: State Name .
    Output: returns all the available districts for that state.

# Chatbot
    Chat Control
    URL: /chat
    Usage: Endpoint for handling chat control.
    Input: request message data  .
    Output: returns response data from chatbot,success(true/false).

# Status TrackPad and License-Authority + Drug Inspector Connector
    Status of STARTUP Application Process
    URL 1 : 
    Input :
    Output : 

# To Verify and validate the token
    the token sent from log in to dashboard will be sent as input.
    URL : /tokenverify
    place of calling : dashboard
    input : token
    output : tokenSuccesss