# Start All URLs With this
    http://localhost:5002/api     then /YOUR_Wanted_below_URL
# Doctor 
    Doctor Registration
    URL: /doctor-reg
    Usage: Endpoint for doctor registration.
    Input: Doctor registration details(name,Email_ID,password....).
    Output: returns Doctor details,success(true).

    Doctor Login
    URL: /doctor-login
    Usage: Endpoint for doctor login.
    Input: Doctor Email_ID,password .
    Output: returns Corresponding details of Doctor,success(true/false).

    Doctor Dashboard
    URL: /doctor-dashboard
    Usage: Endpoint for accessing the doctor dashboard.
    Input: Startup district .
    Output: returns Available startupdetails in that district,success(true/false)

# Drug Inspector
    Drug Inspector Login
    URL: /drugInspector-login
    Usage: Endpoint for drug inspector login.
    Input: DrugInspector Email_ID,password .
    Output: returns Corresponding details of DrugInspector , success(true/false) .

    Drug Inspector Dashboard
    URL: /drugInspector-dashboard
    Usage: Endpoint for accessing the drug inspector dashboard.
   Input: Startup district .
    Output: returns Available startupdetails in that district,success(true/false)

    Drug Inspector Notification Post
    URL: /DI-Notificationpost
    Usage: Endpoint for drug inspectors to post notifications.
    Input:  Startup_Email, NotificationMsgData, Startup_Company.
    Output: returns,success message, Notification data(StartupEmail,DI_Email,message) ,Success(true/false)


    Drug Inspector Notification Sending Startups
    URL: /DI-NotificationSendingStartups
    Usage: Endpoint for drug inspectors to send notifications to startups.
    Input:Drug Inspector Email
    Output:returns list of StartUp(email,company names),Success(true,false)

    Drug Inspector Notification Get
    URL: /DI-NotificationGet
    Usage: Endpoint for drug inspectors to fetch notifications.
    Input:DI_Email,Startup_Email
    Output: notification message for that startup,Success(True/False)

# Farmer
    Farmer Registration
    URL: /farmer-reg
    Usage: Endpoint for farmer registration.
    Input:Farmer details
    Output:farmer data,Success(True/False)

    Farmer Login
    URL: /farmer-login
    Usage: Endpoint for farmer login.
    Input: Farmer Phone_number,password .
    Output: returns Corresponding details of Farmer ,success(true/false)

    Farmer Dashboard
    URL: /farmer-dashboard  rename to /startups-at-farmersdistrict
    Usage: Endpoint for accessing the farmer dashboard.
    Input: Farmer email id .
    Output: returns success(true/false),
            Tokensuccess(True/False),
            StartupRetrievalsuccess(True/False),
            Available startupdetails in that district


# Startup
    Startup Registration
    URL: /startup-reg
    Usage: Endpoint for startup registration.
    Input:Startup details
    Output:Startup data,Success(True/False)

    Startup Login
    URL: /startup-login
    Usage: Endpoint for startup login.
    Input: Startup Email_ID,password .
    Output: returns Corresponding details of Startup ,success(true/false),


    Fill Application In Startup Dashboard 
    URL: /startup-dashboard  rename to /startup-fillapplication 
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