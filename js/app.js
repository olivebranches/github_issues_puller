function resetDivs()
{
	//intialize number of all issues as 0
	document.getElementById("noofissues").innerHTML = 0;
	document.getElementById("issues-x2").innerHTML = 0;
	document.getElementById("issues-x3").innerHTML = 0;
	document.getElementById("issues-x4").innerHTML = 0;
	
	//make all hidden-div for storing table data empty
	$('#hidden-div').empty();
	$('#hidden-div1').empty();
	$('#hidden-div2').empty();
	$('#hidden-div3').empty();

	//create new tables for table data.
	//delete old-tables
	//so that doesn't conflict with jquery datatable
	for(i=1;i<=4;i++)
	{
		$('#issues-table'+i).remove();
		
		var id = "issues-table"+i;
		
		$('#table_data'+i).empty();
$('#table_data'+i).append("<table id="+id+" class='table table-bordered table-striped'></table>");
	
	

	}

}

/**
* function to get issue data of repositories by github api
*/
function getData(value)
{
	
	//get user entered url
	var url = $("#url").val();

	//check for validity of url
	var type = url.slice(0,8);
	var remaining_url = url.slice(8);

	var type1 = url.slice(0,7);
	var remaining_url1 = url.slice(7);
	var url_array;
	if(type1=="http://")
		 url_array = remaining_url1.split("/");
	else if(type=="https://")
		 url_array = remaining_url.split("/");
	//repository name
	var repo_url = url_array[1]+'/'+url_array[2];
	
	if(url==null||url==undefined||url==0||(type+url_array[0] != "https://github.com"&& type1+url_array[0]!="http://github.com"))
	{
		
			alert("Please Enter a valid github repository url!!");
	}

	else 
	{	
		//if hidden-division do not have data -> data is to be fetched
		// fetch data using github api and ajax call
		if($('#hidden-div').html()==null||$('#hidden-div').html()==0||$('#hidden-div')==undefined)
		{
			document.getElementById("noofissues").innerHTML = 0;
			document.getElementById("issues-x2").innerHTML = 0;
			document.getElementById("issues-x3").innerHTML = 0;
			document.getElementById("issues-x4").innerHTML = 0;
			
			//total no. of open issues
			var openissues = 0;
			
			//ajax call for api url
			var xhr = $.ajax({
			url: 'http://api.github.com/repos/'+repo_url+'/issues',
			type: 'GET',
			async: true,
				success : function(data)
				{
					var length = data.length;
					
					intializeTables();
					
					createTable(data, length, repo_url);
					
					//if ajax response headers has link 
					//has more pages of data
					var responseHeaders = xhr.getResponseHeader("Link");

					if(responseHeaders)
					{
						// extract next and last page numbers
							var array = responseHeaders.split(',');
							var pages = [];
							var k = 0;

							for(i=0;i<array.length;i++)
							{
								
								s1 = "page";
								s2 = "pages";
								n1 = s1.length;
								n2 = s2.length;
								s3 = "=";

								if(array[i].indexOf(s2)== -1)
								{
									if(array[i].indexOf(s1)!= -1)
									{
										pages[k] = array[i][array[i].indexOf(s1)+n1+s3.length];
										k++;

									}
								}
								else
								{
									pages[k] = array[i][array[i].indexOf(s2)+n2+s3.length];
									k++;

								}
							}


						// fetch data from next to last pages
						// when completed call display table to display
						// data
							$.when(fetchAllPages(pages, repo_url))
			  				.then(function(continueExecution)
			  				{
			  					// value is the value of selection made
			  					// according to which different types of 
			  					// open issues ar shown
			  					displayTables(value);

			  					
			    			});
						
					}
					else    // if there are no other pages left
						displayTables(value);

					
		    	},
		    	error: function(xhr,error) // if there is an error
		    	{
		    		// if github link not found
		    		if(xhr.status == 404)
						emptyTable();
					
		    	}
		    	
		    });


		}
		else   // if hidden-divisions are not empty - show previously fetched data
			displayTables(value);
		
	}
	
	
}


// display table according to selection made
function displayTables(value)
{
	
	if(value == "1") // show all open issues
    	issueOptionalDisplay($('#hidden-div').html(), value);
    else if(value == "2") // show open issues in 24 hours
    	issueOptionalDisplay($('#hidden-div1').html(), value);
    else if(value == "3") // show open issues more than 24 hours but less than 7 days
    	issueOptionalDisplay($('#hidden-div2').html(), value);
    else if(value == "4") // show open issues more than 7 days
    	issueOptionalDisplay($('#hidden-div3').html(), value);
}

// initialize hidden division with table header
function intializeTables()
{
	
	var concat = "";
	concat += tableHeader();

	$('#hidden-div').append(concat);
	$('#hidden-div1').append(concat);
	$('#hidden-div2').append(concat);
	$('#hidden-div3').append(concat);
}

// empty table shown 404 error occurs
function emptyTable()
{
	
	resetDivs();
	$('#table_data1').show();
	var header = tableHeader();
	$('#issues-table1').append(header);
	$('#issues-table1').append('<tbody>');
	
	$('#issues-table1').append('</tbody>');

	// apply jquery datatable on table
	applyDatatable(1);
		
}

// header for the table
function tableHeader()
{
	
	return '<thead><tr><th>Issue No.</th><th>State</th><th>Title</th><th>Created At</th></tr></thead>';
}

// display data according to selected value
function issueOptionalDisplay(htmldata, value)
{
	// if not htmldata
	if(htmldata ==  undefined|| htmldata == null)
	{
		
		
		for(i=1;i<=4;i++)
		{
			$('#table_data'+i).hide();
			
			if(i!=1)
			{
				$('#issues-x'+i).hide();

			}
		}
		
		$('#table_data'+value).show();
		
		if(value!=1)
		{
			$('#issues-x'+value).show();
			$('#section').show();
		}
		
		$('#issues-table'+value).html('<tbody>No issues</tbody>');	
	}
	else
	{
		
		for(i=1;i<=4;i++)
		{
			// hide all tables
			$('#table_data'+i).hide();
			
			//hide all section issues
			if(i!=1)
				$('#issues-x'+i).hide();
		}
		
		// show table only for this value
		$('#table_data'+value).show();

		// if selected option is not "All issues" show section issues also
		if(value!=1)
		{
			$('#issues-x'+value).show();
			$('#section').show();
		}
		else
			$('#section').hide();

		// create new issue table
		// delete the old one
		$('#issues-table'+value).remove();
		
		var id = "issues-table"+value;
		
		$('#table_data'+value).empty();
$('#table_data'+value).append("<table id="+id+" class='table table-bordered table-striped'></table>");
		
		$('#issues-table'+value).html('</tbody>');
		$('#issues-table'+value).append(htmldata);
		$('#issues-table'+value).append("</tbody>");

		// apply jquery datatable on table
		applyDatatable(value);
	}
}

// function to apply jquery datatable on tables
function applyDatatable(value)
{
	$('#issues-table'+value).dataTable
		({
			"bPaginate": true,
			"bLengthChange": true,
			"bFilter": true,
			"bSort": true,
			"bInfo": true,
			"bAutoWidth": false,
			"aaSorting": [[ 0, "asc"]]
		});

}


// function to fetch data from all the pages other than main page
function fetchAllPages(pages, url)
{
	//start from next page continue till end page
	// fetch data and create table
	// by appending data in hidden-divisions

	for(i = pages[0]; i<=pages[pages.length-1];i++)
	{
		$.ajax({
			url: 'http://api.github.com/repos/'+url+'/issues?page='+i,
			type: 'GET',
			async: true,
			success : function(data1)
			{
				var length = data1.length;
				createTable(data1, length, url);


			}
		});
	}
}

// create tables in hidden-divisions
function createTable(data, length, url)
{
	
	var concat = "";
	var concat1 = "";
	var concat2 = "";
	var concat3 = "";
	var issues = 0;
	var issues1 = 0;
	var issues2 = 0;
	var issues3 = 0;

	for(i=0;i<length;i++)
	{
		// if data state is open 
		// fill hidden-div for all issues
		if(data[i]['state'] == 'open')
        {
        	concat += '<tr>';
        	concat +='<td><a href = "http://github.com/'+url+'/issues/'+data[i]['number']+'">'+data[i]['number']+'</a></td>';
        	concat += '<td>'+data[i]['state']+'</td>';
        	concat +='<td>'+data[i]['title']+'</td>';
        	concat +='<td>'+data[i]['created_at']+'</td>';
        	concat +='</tr>';
        	issues++;

        	// get date and time 24 hours back
        	// adjusted according with GMT 
        	var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000)+(5*60*60*1000)+(30*60*1000));

        	// get date and time 7 days back
        	// adjusted according with GMT
        	var week = new Date(new Date().getTime() - (7*24 * 60 * 60 * 1000)+(5*60*60*1000)+(30*60*1000));
        	
        	// get ISO date format
        	var iso24 = yesterday.toISOString();
        	iso24 = iso24.slice(0,-5)+'Z';

        	var iso7 = week.toISOString();
        	iso7 = iso7.slice(0,-5)+'Z';
        	
        	// if data state is open and was created less than 24 hours ago
        	// fill hidden-div1 with issues created less than 24 hours ago
        	if(data[i]['created_at'] >= iso24)
        	{

        		concat1 += '<tr>';
        		concat1 +='<td><a href = "http://github.com/'+url+'/issues/'+data[i]['number']+'">'+data[i]['number']+'</a></td>';
        		concat1 += '<td>'+data[i]['state']+'</td>';
        		concat1 +='<td>'+data[i]['title']+'</td>';
        		concat1 +='<td>'+data[i]['created_at']+'</td>';
        		concat1 +='</tr>';
        		issues1++;
        	}

        	// if data state is open and was created more than 24 hours ago
        	// but less than 7 days ago fill hidden-div2 with those issues
        	else if(data[i]['created_at'] < iso24 && data[i]['created_at'] >= iso7)
        	{

        		concat2 += '<tr>';
        		concat2 +='<td><a href = "http://github.com/'+url+'/issues/'+data[i]['number']+'">'+data[i]['number']+'</a></td>';
        		concat2 += '<td>'+data[i]['state']+'</td>';
        		concat2 +='<td>'+data[i]['title']+'</td>';
        		concat2 +='<td>'+data[i]['created_at']+'</td>';
        		concat2 +='</tr>';
        		issues2++;
        	}

        	// if data state is open and was created more than 7 days ago
        	// fill hidden-div3 with those issues
        	else if(data[i]['created_at'] < iso7)
        	{

        		concat3 += '<tr>';
        		concat3 +='<td><a href = "http://github.com/'+url+'/issues/'+data[i]['number']+'">'+data[i]['number']+'</a></td>';
        		concat3 += '<td>'+data[i]['state']+'</td>';
        		concat3 +='<td>'+data[i]['title']+'</td>';
        		concat3 +='<td>'+data[i]['created_at']+'</td>';
        		concat3 +='</tr>';
        		issues3++;
        	}

        }
    }
    //get existing values of number of issues
    // parse integer from the values and add new issues 
    var val = $('#noofissues').text();

    var val1 = parseInt(val)+issues;

    var val2 = $('#issues-x2').text();
    var val3 = parseInt(val2)+issues1;

    var val4 = $('#issues-x3').text();
    var val5 = parseInt(val4)+issues2;

    var val6 = $('#issues-x4').text();
    var val7 = parseInt(val6)+issues3;

    // set new values of number of issues for total no. of issues
    // and section issues
    document.getElementById("noofissues").innerHTML = val1;
    $("#issues-x2").html(val3);
    $("#issues-x3").html(val5);
    $("#issues-x4").html(val7);

    // append hidden-div html data
    $('#hidden-div').append(concat);
    $('#hidden-div1').append(concat1);
    $('#hidden-div2').append(concat2);
    $('#hidden-div3').append(concat3);
   
}
