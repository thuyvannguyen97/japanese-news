<div class="widget history-screen">
    <div class="title-history">
    	<span>History</span>
		<a class="btn btn-danger" ng-click="deleteHistory()">Delete</a>
        <a class="btn btn-default" ng-click="hideHistory()"><i class="fa fa-sort-desc" aria-hidden="true"></i></a>
    </div><hr>
    <div class="content">
        <div class="history-item" ng-repeat="item in history.slice().reverse() track by $index" ng-click="search(item.type, item.query);">
            <div class="history-type" value="<% item.type[0] %>"> <% item.type[0] %> </div>
            <div class="his-content"><% item.query %></div>
            <div class="his-time"><% getTime(item.date) %></div>
        </div>
    </div>
</div>