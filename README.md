# github_issues_puller
Technologies Used
  1. Javascript
  2. Jquery
  3. Bootstrap
  4. HTML
  5. github API
  6. AJAX

This is using Javascript and jquery ajax for github api call.

The api call returns data in json format. 

That data is then displayed in the table.

The table supports pagination and searching, sorting.

File Structure:

1. index.html - main entry script - programed
2. js/app.js - main js script for the program - programed
3. js/jQuery.datatables.js - js script for datatables - from library
4. js/datatables.bootstrap.js - js script for datatables with bootstrap
5. css/datatables/datatables.bootstrap.css - stylesheet for datatables
6. css/datatables/images - images to be used in datatables.

Note: The Heroku app uses index.php as the entry script - which containes the same code as index.html only with index.php name and php tags. 


Workflow:

1. User enters a url in the url input.

2. Then he selects what type of issues he wants to see from a selection dropdown.

3. Program first checks validity of the input by checking if it is valid github url.

4. Program then checks if this is first time this data is fetched. Data fetched is stored in hidden-div in html format.

5. If this is first time (hidden-divs are empty) - makes an ajax call to 
  http://api.github.com/repos/github_repo_name/issues
  
6. After making first ajax call - it checks from ajax "link" response header - if there are other pages with data.

7. If there are - it extracts next and last page number.

8. Then make ajax calls to all these pages and collects data in hidden-divisions. 

9. Data from these hidden-divs are shown in table - according to the selection made by the user.

10. When user changes the url input - all tables and hidden-divs get reset.





