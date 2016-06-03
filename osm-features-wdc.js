(function() {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "id",
            alias: "id",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "name",
            alias: "name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "url",
            alias: "url",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "lat",
            alias: "latitude",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "lon",
            alias: "longitude",
            dataType: tableau.dataTypeEnum.float
        }];

        var tableInfo = {
            id: "osm-features",
            alias: "OpenStreetMap Features",
            columns: cols
        };

        schemaCallback([tableInfo]);
    };

    myConnector.getData = function(table, doneCallback) {
        var user_selection = tableau.connectionData.split("|"),
			feat_type = user_selection[0],
            bounds = user_selection[1].replace(/['"]+/g, ""),
			id = 0,
            name = "",
            url = "",
            lat = 0,
            lon = 0;

        $.getJSON("http://overpass-api.de/api/interpreter?data=[out:json];node[%22amenity%22=%22" + feat_type + "%22](" + bounds + ");out;", function(resp) {
            var feat = resp.elements,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                id = feat[i].id;
                name = feat[i].tags.name || "";
                url = feat[i].tags.website || "";
                lat = feat[i].lat;
                lon = feat[i].lon;

                tableData.push({
                    "id": id,
                    "name": name,
                    "url": url,
                    "lat": lat,
                    "lon": lon
                });

            }

            table.appendRows(tableData);
            doneCallback();
        });
    };


    
// Register connector and submit    
    tableau.registerConnector(myConnector);

    $(document).ready(function() {
		$("#feature-menu li").on("click", function () {
			$("#feature-button-text").text($(this).text());
		});

        $("#submitButton").click(function() {
            if ($("#feature-button-text").text() === "Select a feature") {
                alert("Select a feature from the dropdown menu.")
// Note to self: Add validation
            }

            tableau.connectionName = "OSM Features"; 
			tableau.connectionData = $("#feature-button-text").text() + "|" + $("#map").attr("latlon");
            console.log($("#map").attr("latlon"));
            tableau.submit(); 
        });
    });
})();
