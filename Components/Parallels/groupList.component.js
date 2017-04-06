jTextMinerApp.component('groupList',
{
    bindings: {
        list: '<',
        limitShown: '<',
        selected: '<',
        onItemsSelected: '&',
        onLengthChange: '&',
        radioGroup: '@'
    },
    templateUrl: 'Components/Parallels/groupList.component.html',
    controller: ['$scope',
        function($scope) {
            var ctrl = this;
            ctrl.groupedList = [];
            ctrl.groupExpand = [];

            ctrl.runIsEqual = function (a, b) {
                var bool = _.isEqual(a.map(x => x.xmlId), b.map(x => x.xmlId));
                return bool;
            };

            // report how long the list is so the parent component can choose whether to trigger an overflow
            // returns the total length if all lines were shown, and the actual length, since a user might expand a
            // section which increases the total length
            function reportLength() {
                if (!ctrl.groupedList)
                    return ctrl.onLengthChange(0);
                function groupLength(group, offset) {
                    return ctrl.groupExpand[offset] ? group.sublist.length + (group.heading == '' ? 0 : 1) : 1
                }
                const length = _.sum(ctrl.groupedList.map(groupLength));
                const actualLength = _.sum(ctrl.groupedList.slice(0, ctrl.limitShown).map(groupLength));
                ctrl.onLengthChange({length, actualLength});
            }

            ctrl.toggleExpandGroup = function (index) {
                ctrl.groupExpand[index] = !ctrl.groupExpand[index];
                reportLength();
            };

            let cachedOutput = [];
            ctrl.groupList = function () {
                let list = ctrl.list;
                let groups = [];
                if (list.length < 10) {
                    groups = [{
                        heading: '',
                        sublist: list
                    }]
                }
                else {
                    let currentGroup = null;
                    // convert to array of arrays of path elements e.g.['Seder Zeraim','Mishnah Berakhot'...]
                    const lists = list.map(item => item.title.split('/'));
                    let commonPrefixList = [];
                    // run a loop on the path elements until the first time the inner function returns false
                    // the inner loop checks if all the lists have the same value at the index position
                    lists[0].every(
                        (pathElement, index) => {
                            if (lists.every(list => list[index] === pathElement)) {
                                commonPrefixList.push(pathElement);
                                return true;
                            }
                            return false;
                    });
                    const commonPrefix = commonPrefixList.join('/');
                    list.forEach(function(item) {
                        // split a path into three parts path0, /path1 (the capture of the split delimiter)
                        // and path2/path3/path4...
                        var parts = item.title.split(new RegExp("(" + commonPrefix + "/[^\/]*)/"), 2);
                        var heading = parts[0];
                        // if there's a path element path1, add it back to the heading
                        if (parts[1])
                            heading += parts[1];

                        // now that we have a heading, add it to the open group if there is one
                        if (currentGroup && currentGroup.heading === heading) {
                            currentGroup.sublist.push(item);
                            currentGroup.count += item.count;
                            currentGroup.filteredCount += item.filteredCount;
                        }
                        // or create one
                        else {
                            currentGroup = {
                                heading,
                                count: item.count,
                                filteredCount: item.filteredCount,
                                sublist: [item]
                            };
                            groups.push(currentGroup);
                        }
                    });
                }
                reportLength();
                if (_.isEqual(cachedOutput, groups))
                    return ctrl.groupedList;
                cachedOutput = groups;
                // angular modifies anything it uses, so _.isEqual will fail even if we didn't change anything!
                ctrl.groupedList = _.cloneDeep(groups);
                return ctrl.groupedList;
            };

            $scope.$watchCollection("$ctrl.list", ctrl.groupList);
        }]
}); 