jTextMinerApp.factory('SaveClassInterface', function (UserService) {
    var classData = {
        getInstance(settings){
            return {
                select_ClassName: settings.className,
                select_RootKeys: settings.text ? settings.text.keys : [],
            }
        }
    };
    return classData;
});