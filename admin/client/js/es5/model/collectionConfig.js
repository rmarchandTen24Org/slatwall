"use strict";
var slatwalladmin;
(function(slatwalladmin) {
  var Column = function() {
    function Column(propertyIdentifier, title, isVisible, isDeletable, attributeID, attributeSetObject) {
      this.propertyIdentifier = propertyIdentifier;
      this.title = title;
      this.isVisible = isVisible;
      this.isDeletable = isDeletable;
      this.attributeID = attributeID;
      this.attributeSetObject = attributeSetObject;
    }
    return ($traceurRuntime.createClass)(Column, {}, {});
  }();
  var FilterGroup = function() {
    function FilterGroup(filterGroups) {
      this.filterGroups = filterGroups;
    }
    return ($traceurRuntime.createClass)(FilterGroup, {}, {});
  }();
  var Filter = function() {
    function Filter(propertyIdentifier, value, comparisonOperator, logicalOperator) {
      this.propertyIdentifier = propertyIdentifier;
      this.value = value;
      this.comparisonOperator = comparisonOperator;
      this.logicalOperator = logicalOperator;
    }
    return ($traceurRuntime.createClass)(Filter, {}, {});
  }();
  var Join = function() {
    function Join(associationName, alias) {
      this.associationName = associationName;
      this.alias = alias;
    }
    return ($traceurRuntime.createClass)(Join, {}, {});
  }();
  var OrderBy = function() {
    function OrderBy(propertyIdentifier, direction) {
      this.propertyIdentifier = propertyIdentifier;
      this.direction = direction;
    }
    return ($traceurRuntime.createClass)(OrderBy, {}, {});
  }();
  var CollectionConfig = function() {
    function CollectionConfig($slatwall, baseEntityName, baseEntityAlias, columns) {
      var filterGroups = arguments[4] !== (void 0) ? arguments[4] : [];
      var joins = arguments[5];
      var orderBy = arguments[6];
      var currentPage = arguments[7] !== (void 0) ? arguments[7] : 1;
      var pageShow = arguments[8] !== (void 0) ? arguments[8] : 10;
      var keywords = arguments[9] !== (void 0) ? arguments[9] : '';
      this.$slatwall = $slatwall;
      this.baseEntityName = baseEntityName;
      this.baseEntityAlias = baseEntityAlias;
      this.columns = columns;
      this.filterGroups = filterGroups;
      this.joins = joins;
      this.orderBy = orderBy;
      this.currentPage = currentPage;
      this.pageShow = pageShow;
      this.keywords = keywords;
    }
    return ($traceurRuntime.createClass)(CollectionConfig, {
      loadJson: function(jsonCollection) {
        if (angular.isString(jsonCollection)) {
          jsonCollection = angular.fromJson(jsonCollection);
        }
        this.baseEntityAlias = jsonCollection.baseEntityAlias;
        this.baseEntityName = jsonCollection.baseEntityName;
        this.columns = jsonCollection.columns;
        this.currentPage = jsonCollection.currentPage;
        this.filterGroups = jsonCollection.filterGroups;
        this.joins = jsonCollection.joins;
        this.keywords = jsonCollection.keywords;
        this.orderBy = jsonCollection.orderBy;
        this.pageShow = jsonCollection.pageShow;
      },
      getJson: function() {
        var config = this;
        delete config['$slatwall'];
        return angular.toJson(config);
      },
      getEntityName: function() {
        return this.baseEntityName.charAt(0).toUpperCase() + this.baseEntityName.slice(1);
      },
      getOptions: function() {
        return {
          columnsConfig: angular.toJson(this.columns),
          filterGroupsConfig: angular.toJson([{'filterGroup': this.filterGroups}]),
          joinsConfig: angular.toJson(this.joins),
          currentPage: this.currentPage,
          pageShow: this.pageShow,
          keywords: this.keywords
        };
      },
      debug: function() {
        return this;
      },
      formatCollectionName: function(propertyIdentifier) {
        var property = arguments[1] !== (void 0) ? arguments[1] : true;
        var collection = '';
        var parts = propertyIdentifier.split('.');
        for (var i = 0; i < parts.length; i++) {
          if (typeof this.$slatwall['new' + this.capitalize(parts[i])] !== "function") {
            if (property)
              collection += ((i) ? '' : this.baseEntityAlias) + '.' + parts[i];
            break;
          }
          collection += '_' + parts[i].toLowerCase();
        }
        return collection;
      },
      addJoin: function(associationName) {
        var joinFound = false;
        if (angular.isUndefined(this.columns)) {
          this.joins = [];
        }
        var parts = associationName.split('.');
        var collection = '';
        for (var i = 0; i < parts.length; i++) {
          joinFound = false;
          if (typeof this.$slatwall['new' + this.capitalize(parts[i])] !== "function")
            break;
          collection += '.' + parts[i];
          this.joins.map(function(_join) {
            if (_join.associationName == collection.slice(1)) {
              joinFound = true;
              return;
            }
          });
          if (!joinFound) {
            this.joins.push(new Join(collection.slice(1), collection.toLowerCase().replace(/\./g, '_')));
          }
        }
      },
      addAlias: function(propertyIdentifier) {
        var parts = propertyIdentifier.split('.');
        if (parts.length > 1 && parts[0] !== this.baseEntityAlias) {
          return this.baseEntityAlias + '.' + propertyIdentifier;
        }
        return propertyIdentifier;
      },
      capitalize: function(s) {
        return s && s[0].toUpperCase() + s.slice(1);
      },
      addColumn: function(column) {
        var title = arguments[1] !== (void 0) ? arguments[1] : '';
        var options = arguments[2] !== (void 0) ? arguments[2] : {};
        var isVisible = true;
        var isDeletable = true;
        if (angular.isUndefined(this.columns)) {
          this.columns = [];
        }
        if (!angular.isUndefined(options['isVisible'])) {
          isVisible = options['isVisible'];
        }
        if (!angular.isUndefined(options['isDeletable'])) {
          isDeletable = options['isDeletable'];
        }
        this.columns.push(new Column(column, title, isVisible, isDeletable, options['attributeID'], options['attributeSetObject']));
      },
      setDisplayProperties: function(propertyIdentifier) {
        var title = arguments[1] !== (void 0) ? arguments[1] : '';
        var options = arguments[2] !== (void 0) ? arguments[2] : {};
        var $__0 = this;
        var _DividedColumns = propertyIdentifier.trim().split(',');
        var _DividedTitles = title.trim().split(',');
        if (_DividedColumns.length > 0) {
          _DividedColumns.forEach(function(column, index) {
            column = column.trim();
            $__0.addJoin(column);
            if (_DividedTitles[index] !== undefined && _DividedTitles[index] != '') {
              title = _DividedTitles[index].trim();
            } else {
              var startAlias = new RegExp('^' + $__0.baseEntityAlias + '\\.');
              title = column.replace(startAlias, '').replace(/\./g, '_');
            }
            $__0.addColumn($__0.formatCollectionName(column), title, options);
          });
        } else {
          this.addJoin(propertyIdentifier);
          propertyIdentifier = this.addAlias(propertyIdentifier);
          if (title == '')
            title = propertyIdentifier.trim().replace(this.baseEntityAlias + '.', '').replace(/\./g, '_');
          this.addColumn(this.formatCollectionName(propertyIdentifier), title, options);
        }
      },
      addFilter: function(propertyIdentifier, value) {
        var comparisonOperator = arguments[2] !== (void 0) ? arguments[2] : '=';
        var logicalOperator = arguments[3] !== (void 0) ? arguments[3] : '';
        this.addJoin(propertyIdentifier);
        this.filterGroups.push(new Filter(this.formatCollectionName(propertyIdentifier), value, comparisonOperator, logicalOperator));
      },
      setOrderBy: function(propertyIdentifier) {
        var direction = arguments[1] !== (void 0) ? arguments[1] : 'DESC';
        if (angular.isUndefined(this.orderBy)) {
          this.orderBy = [];
        }
        this.addJoin(propertyIdentifier);
        this.orderBy.push(new OrderBy(this.formatCollectionName(propertyIdentifier), direction));
      },
      setCurrentPage: function(pageNumber) {
        this.currentPage = pageNumber;
      },
      setPageShow: function(NumberOfPages) {
        this.pageShow = NumberOfPages;
      },
      setKeywords: function(keyword) {
        this.keywords = keyword;
      }
    }, {});
  }();
  slatwalladmin.CollectionConfig = CollectionConfig;
})(slatwalladmin || (slatwalladmin = {}));

//# sourceMappingURL=../model/collectionConfig.js.map