Table of Contents
=================
1.  Import and Build ESPM Projects
1.1   How to import ESPM projects into Eclipse IDE
1.2   How to build all ESPM projects

2. ESPM Ui projects
2.1   WebShop application
2.1.1   How to run ESPM WebShop applications on local server
2.1.2   How to run ESPM WebShop applications on HANA Cloud
2.1.3   Integration tests
2.2   Retailer application
2.2.1   How to run ESPM retailer applications on local server
2.2.2   How to run ESPM retailer applications on HANA Cloud
2.2.3   Integration tests
2.3   Webreviews application
2.3.1   How to run ESPM webreviews applications on local server
2.3.2   How to run ESPM webreviews applications on HANA Cloud
2.3.3   Integration tests

3. ESPM Cloud OData Service Project
3.1   How to run espm-cloud-web OData Service integration test

4. ESPM SAPUI5 mobile application
4.1   How to run 'espm-mobile-shopping-web' applications on local server


1. Import and Build ESPM Projects
=================================
1.1 How to import ESPM projects into Eclipse IDE
------------------------------------------------
1. Make sure that you have installed a development environment as described in ESPM Scenarios Installation Guide
   available on http://scn.sap.com/docs/DOC-46868
   (chapter 1 and 2)

1.2 How to build all ESPM projects
----------------------------------
1. Select espm/pom.xml and choose "Run as..." > Maven build...
2. In the opened 'Edit Configuration' dialog enter 'clean install' in the Goals field.
3. Choose run to start the Maven build


2. ESPM Ui projects
===================
2.1 WebShop application
-----------------------
WebShop application is part of espm-cloud-web project (espm-cloud-web/src/main/webapp/webshop)

2.1.1 How to run ESPM WebShop applications on local server
--------------------------------------------------------------
2.1.1.1 Backend configurations (this is optional, because the defaults should always work) 

1a Public ABAP backend system (Cloud hosted 'SAP NetWeaver Application Server ABAP 7.4 SP2')
   OData service URL, user and password:
   * See espm/destinations/abapbackend
   Images base URL, user and password:
   * See espm/destinations/abapbackendimages

1b HANA Cloud backend is configured for application 'webcloudmodel' and account 'espmhana':
   OData service:
   * See espm/destinations/cloudbackend
   Images base URL, user and password:
   * See espm/destinations/cloudbackendimages

1c HANA Cloud extension backend is configured for application 'webcloudmodelext' and account 'espmhana':
   OData service:
   * See espm/destinations/cloudextensionbackend

2.1.1.2 Create and Configure SAP HANA Cloud local runtime
   * On Servers view: New > Server; select SAP > SAP HANA Cloud local runtime; 
   * Choose Next > If necessary you can specify an 'HTTP port'. By default it is 8080 (if no other server is already using this port)
   * Choose Finish
   * Double-click on newly created server node to open server editor; click 'Open launch configuration'
   * If you are working behind a company firewall you might need to set a network proxy to access the internet.
     If you don't have a network proxy skip the 'Set Network Proxy' steps.
     Set Network Proxy steps:
     - Add the following string as vm Arguments on Arguments tab
       -Dhttp.proxyHost=proxy -Dhttp.proxyPort=8080 -Dhttps.proxyHost=proxy -Dhttps.proxyPort=8080 -Dhttp.nonProxyHosts=*.corp
     - Confirm configuration dialog with OK
   * (Back) in the server editor: Switch to 'Connectivity' tab
   * Import existing destinations:
     (after each destination import save it and confirm opened dialog to deploy the imported destination to the server)
     i)   espm/destinations/abapbackend
     ii)  espm/destinations/abapbackendimages
     iii) espm/destinations/cloudbackend
     iv)  espm/destinations/cloudbackendimages
     v)   espm/destinations/cloudextensionbackend

2.1.1.3 Run web application on SAP HANA Cloud local runtime
   * Select project node espm-cloud-web
   * From context menu choose Run As > Run on Server.
   * Choose 'Choose existing server option' and select the before created local server
   * Choose Finish to start up the local server.
   * Browser opens and displays as initial page the odata service 
     localhost:port/espm-cloud-web/espm.svc/?$format=xml
     To launch the WebShop application change this URL to
     localhost:port/espm-cloud-web/webshop to start the WebShop application

2.1.2 How to run ESPM WebShop applications on HANA Cloud
--------------------------------------------------------
2.1.2.1 Backend configurations (this is optional, because the defaults should always work)
The backend configuration works the same as described above for the local server runtime.

2.1.2.2 Create and Configure new SAP HANA Cloud server
   * Configure your SAP HANA Cloud Server Eclipse preferences: 'Server' > 'SAP HANA Cloud'
   * On Servers view: New > Server; select option 'Manually define a new server'
   * Select SAP > 'SAP HANA Cloud' and choose Next
   * Specify the parameters for the SAP HANA Cloud Application to be run on the new server 
     (e.g. application: 'webshop' and account: '<YOUR ACCOUNT NAME>')
   * Choose Finish to create a new server (without any application yet)
   * Double-click on newly created server node to open server editor
   * Switch to connectivity tab
   * Import existing destinations:
     (after each destination import save it and confirm opened dialog to deploy the imported destination to the server)
     i)   espm/destinations/abapbackend
     ii)  espm/destinations/abapbackendimages
     iii) espm/destinations/cloudbackend
     iv)  espm/destinations/cloudbackendimages
     v)   espm/destinations/cloudextensionbackend

2.1.2.3 Deploy on SAP HANA Cloud
   * Select project node espm-cloud-web
   * From context menu choose Run As > Run on Server.
   * Choose 'Choose existing server option' and select the before created cloud server
   * Choose Finish to start up the cloud server.
   * Browser opens and displays as initial page the odata service 
     server:port/espm-cloud-web/espm.svc/?$format=xml
     To launch the WebShop application change this URL to
     server:port/espm-cloud-web/webshop to start the WebShop application

   Example: ESPM WebShop launch Url (running on SAP HANA Factory landscape)
   https://cloudmodelespmhana.hana.ondemand.com/espm-cloud-web/webshop

2.1.3 Integration tests
-----------------------
   0.  The Selenium UI test for WebShop application is defined in EspmShoppingIT.java
   1.  Run integration tests as part of Maven build (Automated Test)
       Maven Run Configuration:
         - Goals: value depends on network proxy 
             i)  Network with proxy: 'verify -Dlocal.integration.tests' 
             ii) Network without proxy: 'verify -Dlocal.integration.tests -D local.integration.tests -Dlocal.server.proxy.settings= -Dbrowser.proxy.settings=' 
         - Parameters:
           * [optional] integration.test.server.url: http://localhost:8080 (this is the default value)
           * [optional] integration.test.application.relpath: /espm-cloud-web/webshop (this is the default value) 
   2. Run integration tests manually from Eclipse (this allows also to debug the integration tests, just use 'Debug As')
        - 1. Create a local test server with port 8080(!) as described in above section 2.1.1.2
        - 2. Run 'espm-cloud-web/webshop' on local server as described in above section 2.1.1.3
        - 3. Create and Run new JUnit Run configuration
             - First select 'JUnit 4' as Testrunner (default is JUnit 3 which does not work) 
             - Project: espm-cloud-web
             - Testclass: com.sap.espm.shopping.web.EspmShoppingIT
             - [optional] -Dintegration.test.server.url=http://localhost:8080 (this is the default value)
             - [optional] -Dintegration.test.application.relpath=/espm-cloud-web/webshop (this is the default value)
             - Run configured JUnit test


2.2 Retailer
------------
Retailer application is part of espm-cloud-web project (espm-cloud-web/src/main/webapp/retailer)

The retailer ESPM Ui application works a bit different from WebShop, because
  1. retailer application does not need a destination which specifies the OData service url (the retailer Ui works directly on the cloud
     odata service, which is part of the espm-cloud-web application. See for the odata service below section 4)
  2. needs a configured user which is assigned to 'Retailer' role, as only users with this role are allowed to use the retailer Ui

2.2.1 How to run ESPM retailer applications on local server
-----------------------------------------------------------
2.2.1.1 Create local server 
   * Select project node 'espm-cloud-web'
   * From context menu choose Run As > Run on Server.
   * On Servers view: Choose 'Manually define a new server' option and select SAP > SAP HANA Cloud local runtime as
     server type
   * Choose Finish to start up the local server.
   * Browser opens and launches the base URL of the OData service of the espm-cloud-web application
     http://localhost:8080/espm-cloud-web/espm.svc/?$format=xml (if the default port 8080 was free when creating the
     local server) OData Service example URL to retrieve the list of Products stored initially in the database of 
     espm-model:
     Confirm that http://localhost:8080/espm-cloud-web/espm.svc/Products results in a list of Products
   * Launch the URL http://localhost:8080/espm-cloud-web/retailer/ in your browser and you will be prompted for user id and password.
   * Use next step 2.2.1.2 to setup local test IdP and specify role on SAP HANA Cloud local runtime

2.2.1.2 How to setup local test IdP and specify role on SAP HANA Cloud local runtime
SAP HANA Cloud local runtime supports creation of users and providing roles for the same

ESPM Cloud Webshop applications has some parts of the application restricted to a user role called as Retailer. Only a user with a role retailer can access these restriced parts like urls
E.g http://localhost:8080/espm-cloud-web/espm.svc/secure/Suppliers is only accessible to user with Retailer role. On launching this url the user is redirected to a login page

Setup steps to create a test IdP for local server
    * In the Eclipse IDE, open the Servers view.
    * Double-click on the Local Server node. The local server editor opens.
    * Go to the Users tab.
    * Click on + button in 'All Users' section and add a new user and specify a password (e.g. user name: admin, password: admin)
    * Click on + button in 'Roles' section and add the role 'Retailer'.
    * Click on Save

2.2.1.3 Test retailer application with newly created user with role 'Retailer'
    * Launch the URL http://localhost:8080/espm-cloud-web/espm.svc/secure/Suppliers
    * On being redirected to the login page enter the user and password and click on Logon button
    * The supplier odata service will be displayed
    * Launch the URL http://localhost:8080/espm-cloud-web/retailer/ in your browser and you will be able to see the retailer Ui

2.2.2 How to run ESPM retailer applications on HANA Cloud
---------------------------------------------------------
2.2.2.1 Create a new SAP HANA Cloud server
   * Configure your SAP HANA Cloud Server Eclipse preferences: 'Server' > 'SAP HANA Cloud'
   * On Servers view: New > Server; select option 'Manually define a new server'
   * Select SAP > 'SAP HANA Cloud' and choose Next
   * Specify the parameters for the SAP HANA Cloud Application to be run on the new server 
     (e.g. application: 'webcloudmodel' and account: '<YOUR ACCOUNT NAME>')
   * Choose Finish to create a new server (without any application yet)

2.2.2.2 Deploy on SAP HANA Cloud
   * Select project node 'espm-cloud-web'
   * From context menu choose Run As > Run on Server.
   * Choose 'Choose existing server option' and select the before created local server
   * Choose Finish to start up the local server.
   * Browser opens and displays the initial page of the 'espm-cloud-web' application

2.2.2.3 How to specify role on SAP HANA Cloud for a user

After you deployed the application to SAP HANA Cloud, the role becomes visible in the Cockpit. In case of SAP HANA
Cloud the user will be your SCN user. The IdP in this case will be SAP ID services. You will have access to the
restricted areas based on the role assigned to your user. 

1a Assign role to user
    * In the SAP HANA Cloud Cockpit (e.g. trial launch URL: https://account.hanatrial.ondemand.com/cockpit), choose the 
      Authorization tab.
    * Enter the Users subtab.
    * Search for your user in User field and click show roles
    * No roles will be shown as they are yet to be assigned
    * Choose on Assign button
    * In the Popup select the application deployed on cloud (E.g. webcloudmodel)
    * Select the Role with name 'Retailer'
    * Choose Save button
1b Test the roles
    * Launch the URL <cloud-account-application-url>/espm-cloud-web/espm.svc/secure/Suppliers
    * On being redirected to the login page enter the user and password and click on Logon button
    * The supplier odata service will be displayed
    * Launch the URL <cloud-account-application-url>/espm-cloud-web/retailer/ in your browser.

   Example: ESPM retailer launch Url (running on SAP HANA Factory landscape)
   https://cloudmodelespmhana.hana.ondemand.com/espm-cloud-web/retailer

2.2.3 Integration tests
-----------------------
   0.  The Selenium UI test for retailer application is defined in ESPMRetailerIT.java.
   1.  Run integration tests as part of Maven build (Automated Test)
       Maven Run Configuration:
         - Goals: value depends on network proxy 
             i)  Network with proxy: 'verify -Dlocal.integration.tests' 
             ii) Network without proxy: 'verify -Dlocal.integration.tests -D local.integration.tests -Dlocal.server.proxy.settings= -Dbrowser.proxy.settings=' 
         - Parameters:
           * [optional] integration.test.server.url: http://localhost:8080 (this is the default value)
           * [optional] integration.test.application.relpath: /espm-cloud-web/retailer (this is the default value)
   2. Run integration tests manually from Eclipse (this allows also to debug the integration tests, just use 'Debug As')
        - 1. Create a local test server with port 8080(!) as described in above section 2.2.1.1
          2. Create a user with name 'ret' and password '123' and assign the user to Retailer role as described in section 2.2.1.2
        - 3. Run 'espm-cloud-web' on local server as described in above section 2.2.1.3
        - 4. Create and Run new JUnit Run configuration
             - First select 'JUnit 4' as Testrunner (default is JUnit 3 which does not work) 
             - Project: espm-cloud-web
             - Testclass: com.sap.espm.retailer.web.ESPMRetailerIT 
             - [optional] -Dintegration.test.server.url=http://localhost:8080 (this is the default value)
             - [optional] -Dintegration.test.application.relpath=/espm-cloud-web/retailer (this is the default value)
             - Run configured JUnit test


2.3 Webreviews application
--------------------------
Webreviews application is part of espm-ui-reviews-web

2.3.1 How to run ESPM webreviews applications on local server
-------------------------------------------------------------
2.3.1.1 Backend configurations
same as for WebShop (see 2.1.1.1) but cloudextensionbackend has no effect as webreviews works always with its own OData service

2.3.1.2 Create and Configure SAP HANA Cloud local runtime
same as for WebShop (see 2.1.1.2) but cloudextensionbackend is not needed as webreviews works always with its own OData service

2.3.1.3 Run web application on SAP HANA Cloud local runtime
same as for WebShop (see 2.1.1.2) but the webreviews application is started initially so there is no need to change the launched URL

Example: ESPM web application launch Url (running on SAP HANA Factory landscape)
webreviews app: https://webreviewsespmhana.hana.ondemand.com/espm-ui-reviews-web/


2.3.2 How to run ESPM webreviews applications on HANA Cloud
-----------------------------------------------------------
2.3.2.1 Backend configurations
same as for WebShop (see 2.1.2.1) but cloudextensionbackend has no effect as webreviews works always with its own OData service

2.3.2.2 Create and Configure new SAP HANA Cloud server
   * Configure your SAP HANA Cloud Server Eclipse preferences: 'Server' > 'SAP HANA Cloud'
   * On Servers view: New > Server; select option 'Manually define a new server'
   * Select SAP > 'SAP HANA Cloud' and choose Next
   * Specify the parameters for the SAP HANA Cloud Application to be run on the new server 
     (e.g. application: 'webreviews' and account: '<YOUR ACCOUNT NAME>')
   * Choose Finish to create a new server (without any application yet)
   * Double-click on newly created server node to open server editor
   * Switch to connectivity tab
   * Import existing destinations:
     (after each destination import save it and confirm opened dialog to deploy the imported destination to the server)
     i)   espm/destinations/abapbackend
     ii)  espm/destinations/abapbackendimages
     iii) espm/destinations/cloudbackend
     iv)  espm/destinations/cloudbackendimages

2.3.2.3 Deploy on SAP HANA Cloud
   * Select project node espm-ui-reviews-web
   * From context menu choose Run As > Run on Server.
   * Choose 'Choose existing server option' and select the before created cloud server
   * Choose Finish to start up the cloud server.
   * Browser opens and displays webreviews application as initial page
     server:port/espm-ui-reviews-web/

   Example: ESPM webreviews launch Url (running on SAP HANA Factory landscape)
   https://webreviewsespmhana.hana.ondemand.com/espm-ui-reviews-web/

2.3.3 Integration tests
-----------------------
   0.  The Selenium UI test for webreviews application is defined in in CustomerReviewsIT.java. 
       The OData integration test is defined in CustomerReviewOdataIT.java for Web Reviews Application
   1.  Run integration tests as part of Maven build (Automated Test)
       Maven Run Configuration:
         - Goals: value depends on network proxy 
             i)  Network with proxy: 'verify -Dlocal.reviews.integration.tests' 
             ii) Network without proxy: 'verify -Dlocal.reviews.integration.tests -Dlocal.server.proxy.settings= -Dbrowser.proxy.settings=' 
         - Parameters:
           * [optional] integration.test.server.url: http://localhost:8080 (this is the default value)
           * [optional] integration.test.application.relpath: /espm-ui-reviews-web (this is the default value) 
   2. Run integration tests manually from Eclipse (this allows also to debug the integration tests, just use 'Debug As')
        - 1. Create a local test server with port 8080(!) as described in above section 2.3.1.2
        - 2. Run 'espm-ui-reviews-web' on local server as described in above section 2.3.1.3
        - 3. Create and Run new JUnit Run configuration
             - First select 'JUnit 4' as Testrunner (default is JUnit 3 which does not work) 
             - Project: espm-ui-reviews-web
             - Testclass: com.sap.espm.ui.reviews.web.CustomerReviewsIT (or CustomerReviewOdataIT)
             - [optional] -Dintegration.test.server.url=http://localhost:8080 (this is the default value)
             - [optional] -Dintegration.test.application.relpath=/espm-ui-reviews-web (this is the default value)
             - Run configured JUnit test


3.  ESPM Cloud OData Service Project
====================================
The ESPM OData service web application is part of espm-cloud-web project (espm-cloud-web/src/main/webapp/index.html)

3.1 How to run espm-cloud-web OData Service integration test
------------------------------------------------------------
   Odata Integration Tests are disabled by default. To execute odata integration test during the build activate the
   profile local-integration-tests. 
   This can done by running maven build (see section 1.2) with additional configuration
   - Parameters:
      * local.integration.tests: true

4. ESPM SAPUI5 mobile application
=================================

4.1 How to run 'espm-mobile-shopping-web' applications on local server
----------------------------------------------------------------------

4.1.1. Create and Configure new SAP HANA Cloud local runtime
   * On Servers view: New > Server; select SAP > SAP HANA Cloud local runtime; choose Finish
   * Double-click on newly created server node to open server editor; click 'Open launch configuration'
   * If you are working behind a company firewall you might need to set a network proxy to access the internet.
     If you don't have a network proxy skip the 'Set Network Proxy' steps.
     Set Network Proxy steps:
     - Add the following string as vm Arguments on Arguments tab
       -Dhttp.proxyHost=proxy -Dhttp.proxyPort=8080 -Dhttps.proxyHost=proxy -Dhttps.proxyPort=8080 -Dhttp.nonProxyHosts=*.corp
     - Confirm configuration dialog with OK
   * (Back) in the server editor: Switch to 'Connectivity' tab
   * Import existing destinations:
     (after each destination import save it and confirm opened dialog to deploy the imported destination to the server)
     i)   espm-mobile/destinations/abapmobilebackend
     ii)  espm-mobile/destinations/cloudmobilebackend

4.1.2 Run web application on SAP HANA Cloud local runtime
   * Select 'espm-mobile-shopping-web' project node
   * From context menu choose Run As > Run on Server.
   * Choose 'Choose existing server option' and select the before created local server
   * Choose Finish to start up the local server.
   * Browser (use only Chrome Web Browser as mentioned in the above Prerequisite) opens and displays the initial page
     of espm mobile application
   * Add ?sap-ui-xx-fakeOS=ios (or =android or =blackberry) to simulate the corresponding device appearance
     Example Url: http://localhost:8080/espm-mobile-shopping-web/?sap-ui-xx-fakeOS=ios