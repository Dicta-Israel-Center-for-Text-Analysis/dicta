
jTextMinerApp.controller('AfterLoginController', function ($scope, ngDialog, ExperimentService, $location, APIService, focus, AlertsService, InProgressService, $filter, ClassificationService, FeatureService, ClassService, SelectClassService, SaveClassInterface, ParallelsService, CAPIService) {

    $scope.isShow = false;
    ExperimentService.updateExperimentTypeModelValue("Classification");
    $scope.currentUser = ExperimentService.user;
    if (ExperimentService.isNewExperiment)
        ExperimentService.isNewExperiment = false;

    if (ExperimentService.user == 'user')
        $location.path('Login');


    $scope.ExperimentTypeModel = ExperimentService.ExperimentTypeModel;
    $scope.$watch('ExperimentTypeModel', function () {
        ExperimentService.updateExperimentTypeModelValue($scope.ExperimentTypeModel);
    });

    $scope.$on('valuesUpdated', function () {
        $scope.ExperimentTypeModel = ExperimentService.ExperimentTypeModel;
    });
    $scope.$on('userUpdated', function () {
        $scope.currentUser = ExperimentService.user;
    });
    

    $scope.ExperimentMode = ExperimentService.ExperimentMode;
    $scope.$watch('ExperimentMode', function () {
        ExperimentService.updateExperimentModeValue($scope.ExperimentMode);
    });


    $scope.Back = function () {
        $location.path('Login');
    }
    $scope.NewExperimentName = ExperimentService.NewExperimentName;
    $scope.LoadPreviousResults = '';

    $scope.LoadExperiment = function (fileName) {
        $scope.LoadPreviousResults = fileName;
        $scope.ExperimentMode = 'UploadStoredExperiment';
        $scope.Next();
    }

   
    $scope.StartNewExperiment = function (actionMode) {
        $scope.ExperimentMode = 'NewExperiment';

        $scope.showClassDialog = true;

        ClassService.updateClassName('class ' + ClassService.Corpus_maxId);

        var selRootNodes = $("#trainTree").dynatree("getTree").getSelectedNodes(true);
        // Get a list of ALL selected nodes
        selRootNodes = $("#trainTree").dynatree("getTree").getSelectedNodes(false);

        var selRootKeys = $.map(selRootNodes, function (node) {
            return node.data.key;
        });
        for (var i in selRootKeys) {
            $("#trainTree").dynatree("getTree").getNodeByKey(selRootKeys[i]).select(false);
        }

        ClassService.updateExperimentActionMode(actionMode);
        //$scope.Next();
    }

    $scope.Next = function () {
        if ($scope.ExperimentMode == 'NewExperiment' && $scope.NewExperimentName.length == 0)
            AlertsService.determineAlert({ msg: 'Please give a name for new experiment.', type: 'danger' });
        else {
            if (($scope.ExperimentMode == 'UploadStoredExperiment' && $scope.LoadPreviousResults.length == 0)) {
                AlertsService.determineAlert({ msg: 'Please choose stored experiment', type: 'danger' });
            }
            else {
                InProgressService.updateIsReady(0);

                if ($scope.ExperimentMode == 'NewExperiment') {
                    ExperimentService.updateNewExperimentName($scope.NewExperimentName);

                    $scope.data = {};
                    $scope.data.userLogin = ExperimentService.user;
                    $scope.data.expType = ExperimentService.ExperimentTypeModel;

                    // http://www.aspsnippets.com/Articles/AngularJS-Get-and-display-Current-Date-and-Time.aspx
                    var date = new Date();
                    $scope.formatedDate = $filter('date')(new Date(), 'dd.MM.yyyy HH-mm-ss');

                    //ExperimentService.ExperimentName += ' ' + $scope.formatedDate;
                    $scope.data.expName = ExperimentService.ExperimentName;

                    APIService.apiRun({ crud: 'NewExperiment' }, $scope.data, function (response) {
                        InProgressService.updateIsReady(1);

                        if (response.userLogin.length != 0) {
                            AlertsService.determineAlert({ msg: 'NewExperiment', type: 'success' });
                            //$location.path($scope.ExperimentTypeModel);
                            $scope.GoToNextTab();
                        }
                        else
                            AlertsService.determineAlert({ msg: 'There is such exp name', type: 'success' });
                    });
                }
                else {
                    ExperimentService.updateStoredExperimentName($scope.LoadPreviousResults);

                    $scope.data = {};
                    $scope.data.userLogin = ExperimentService.user;
                    $scope.data.expType = ExperimentService.ExperimentTypeModel;
                    $scope.data.expName = ExperimentService.ExperimentName;

                    APIService.apiRun({ crud: 'DownloadStoredExperiment' }, $scope.data, function (response) {
                        InProgressService.updateIsReady(1);
                        AlertsService.determineAlert({ msg: 'DownloadStoredExperiment', type: 'success' });
                        $scope.UpdateData(response);
                        FeatureService.updateTotalNumberOfFeatures(null);
                        $scope.UpdateExtractFeaturesData();
                        APIService.apiRun({ crud: 'ExtractFeaturesClassification' }, $scope.data, function (response) {
                            var results = response;
                            //$location.path($scope.ExperimentTypeModel);
                            $scope.GoToNextTab();
                        });

                    });
                }

            }
        }
    }
   

    focus('focusMe');



    $scope.fileNameList = [];
    $scope.searchedFileNameList = [];
    $scope.comparedFileNameList = [];

    $scope.data = {};
    $scope.data.userLogin = ExperimentService.user;

    $scope.data.expType = ExperimentService.ExperimentTypeModel;
    APIService.apiGetArray({ crud: 'GetUploadStoredExperiments' }, $scope.data, function (response) {
        $scope.fileNameList = response;
        AlertsService.determineAlert({ msg: 'Getting file\'s names is successed', type: 'success' });
    });


    $scope.UpdateData = function (data) {
        //ExperimentService.updateExperimentModeValue();
        ExperimentService.updateExperimentTypeModelValue(data.expType);
        ExperimentService.updateExperimentName(data.expName);

        ExperimentService.updateselectedAlgorithmTypeValue(data.selectedAlgorithmTypeId, data.selectedAlgorithmTypeName, data.selectedAlgorithmTypeAttributes);

        ClassificationService.updateClassification_ExperimentTypeValue(data.classificationExperimentMode);
        ClassificationService.updateClassification_CrossValidationFoldsValue(data.classificationCrossValidationFolds);

        ClassService.Corpus_maxId = data.corpusMaxId;

        FeatureService.Feature_sets = data.featureSets;
        ClassService.Corpus_classes = data.corpusClasses;

        FeatureService.updateFeaturesData(data.featuresData);

        SelectClassService.lastTestSetSelectedRootKeys = data.selectTestTextKeys;

        ExperimentService.updateCvResultData(data.cvResultData);
        ExperimentService.updateTsResultData(data.tsResultData);


    }
    $scope.UpdateExtractFeaturesData = function () {
        $scope.data = {};
        $scope.data.userLogin = ExperimentService.user;
        $scope.data.expType = ExperimentService.ExperimentTypeModel;


        $scope.data.expName = ExperimentService.ExperimentName;

        $scope.data.featureSets = FeatureService.Feature_sets;
        $scope.data.corpusClasses = ClassService.Corpus_classes;

        $scope.data.featuresData = FeatureService.featuresData;

    }

    $scope.cancelClass = function () {
        $scope.showClassDialog = false;

    }


    $scope.saveClass = function () {
        SelectClassService.lastTestSetSelectedRootKeys = SelectClassService.lastSelectedRootKeys;
        $scope.Next();

    }

   
    $scope.GoToNextTab = function () {

        InProgressService.updateIsReady(0);
        $scope.data = {};
        $scope.data.chunks = [
                "הלכה א \r\nהתלולות הקרובות בין עיר לעיר ובין לדרך אחד חדשות ואחד ישנות טמאין מפני שהנשים קוברות שם את נפליהן ומוכי שחין את איבריהן הרחוקות חדשות טהורות ישנות טמאות שאני אומר שמא היה שם דרך או עיר ואיזו הוא תלולות זו תלולות של עפר שעל גבי בקוע המאהיל על מקצתה טמא ואין צריך לומר כנגד כלה עפרה טמאה משום עפר תלולות חתל ממנה עפר וסמכו לה אין בו משום עפר תלולות התלולות שהיתה טמאה וטהורה הרי זו טהורה ואין חושש שמא נטמאת: \r\n\r\nהלכה ב \r\nאחד המוציא שלשה מתים ואחד המוציא שלשה כוכין ואחד המוציא כוך בקיע ומערה אחד מצא עשרה ואין ביניהן מארבע אמות ועד שמונה יש להם תפיסה ואין להם שכונות קברות דברי ר' שמעון וחכמים אומרים רואה את האמצעיים כאילו אינן והחיצונין מצטרפין מארבע אמות ועד שמונה מצא ראשו של זה בצד מרגלותיו אין לו תפיסה ואין לו שכונות קברות ראשו של זה בצד מרגלותיו של זה וראשו של זה בצד מרגלותיו של זה וראשו של זה בצד מרגלותיו של זה יש להן תפיסה ואין להן שכונות קברות והחסר אין לו תפיסה ואין לו שכונת קברות ואי זה חסר רבי אומר כדי שינטל מן החי וימות מצא שנים כתחלה ואחד ידוע יש לו תפיסה ואין להן שכונות קברות: \r\n\r\nהלכה ג \r\nמעשה בר' ישבב שבדק ומצא שנים בתחלה ואחד היה ידוע עשה להן תפיסה עשה להן שכונות קברות כשבא אל ר' עקיבא אמר כל שיגעת לריק יגעת אף אתה היית צריך לבדוק כל קברי ארץ ישראל הידועין ולא אמרו אלא המוצא שלש כתחלה: \r\n\r\nהלכה ד \r\nמצא אחד בצד רשות הרבים מכאן ושנים בצד רשות הרבים מכאן בודק מכאן ומכאן ומניח את רשות הרבים שנים בצד גדר ואחד בצד גדר מכאן אין צריך לבדוק את מקום הגדר שכן דרך הבונה להיות בודק עד שמגיע לסלע או לבתולה: \r\n\r\nהלכה ה \r\nואיזו היא בתולה כל שאין בה רושם ואין עפרה תיחוח בדק והגיע למים הרי זו בתולה בדק ומצא שם חרס הרי זו כבתולה: \r\n\r\nהלכה ו \r\nהבודק בית שמאי אומרים בודק שתים ומניח אמה ובית הלל אומרים בודק אמה ומניח אמה דברי ר' עקבא וחכמים אומרים בית שמאי אומרים בודק אמה ומניח אמה ובית הלל אומרים בודק אמה ומניח שתים: \r\n\r\nהלכה ז \r\nהבודק את העפר ממקום הטומאה אוכל בדמעו ר' יהודה אומר צובר עפרה אמה של זו על גבי עפרה של זו ורבותינו אמרה עפרה טהור: \r\n\r\nהלכה ח \r\nהבודק אוכל בדמעו מפקיח הגל אין אוכל בדמעו שאלו תלמידיו את רבן יוחנן בן זכאי בודק מהו שיאכל אמר להם אינו אוכל אמרו לו למדתנו שיאכל אמר להם יפה אמרתם מעשה שעשו ידי וראו עיני ושכחתי כששמעו אזני על אחת כמה וכמה ולא שהיה יודע אלא שהיה מבקש לזרז את התלמידים ויש אומרים את הלל הזקן שאלו ולא שהיה יודע אלא שהיה מבקש לזרז את התלמידים ר' יהשע אומר השונה ואינו עמל כאיש זורע ולא קוצר והלמד תורה ושוכח דומה לאשה שיולדת וקוברת ר' עקיבא אומר זמר בי תדירה זמר: \r\n\r\nהלכה ט \r\nנמצאת אומר שלש קברות הן קבר הנמצא מפנין אותו פנוהו ממקומו טהור ואסור בהנאה קבר המזיק את הרבים מפנין אותו פנוהו מקומו טמא ואסר בהנאה קבר הידוע אין מפנין פנוהו מקומו טהור ומותר בהנאה: \r\n\r\nהלכה י \r\nשדה שאבד קבר בתוכה הנכנס לתוכה טמא בדק ומצא בה קבר הנכנס לתוכה טהור שאני אומר קבר שאבד הוא קבר הנמצא בדק ומצא בתוכה שלש קברות הנכנס לתוכה טהור ואין חוששין שמא שכונת קברות הן: \r\n\r\nהלכה יא \r\nהמפנה קברו לרשות הרבים והלך לשם אדם מפנה עצם עצם והכל טהור מי שנפחת קברו בתוך שדהו אומרים לו מלקט עצם עצם והכל טהור: \r\n\r\nהלכה יב \r\nמעשה ביהודה והלל אחין בניו של רבן גמליאל שהיו מהלכין בתחום עוני מצאו אדם אחד שנפחת קברו בתוך שדהו אמרו לו מלקט עצם עצם והכל טהור: פוסא שמטילין לתוכה הרוגים והנקבר שלא ברשות אין לו תפיסת קברות ואין לו שכונת קברות רבן שמעון בן גמליאל אומר נפלים אינן קונין את הקבר ואין להן תפיסה והנקבר שלא ברשות יש לו תפיסה: \r\n\r\nהלכה יג \r\nר' יהודה אומר בור שמטילין נפלים לתוכו טהור אמר ר' יהודה מעשה בשפחתו של מציק אחד ברמון שהטיל נפל לבור ובא כהן אחד והציץ לידע מה הפילה ובא מעשה לפני חכמים וטהרוהו מיד מפני שחולדה וברדלה גוררין אותו מיד: \r\n\r\nהלכה יד \r\nקבר שסתם פתחו אינו מטמא מכל סביביו פרץ את פצימיו וחזר וסתמו מטמא מכל סביביו נפרצה בו פרצה אחת של ארבעה טפחים בין מלמעלה בין מלמטה אינו טמא אלא כנגד הפרצה בלבד היה לו פתח אחד לצפון ופתח לו פתח אחד לדרום טהור דרומי את הצפוני: \r\n",
                "בן זומא אומר איזהו חכם הלומד מכל אדם שנאמר מכל מלמדי השכלתי (תהלים קי'ט צ'ט). איזהו עלוב שבעלובים זה שהוא עלוב כמשה רבינו שנאמר והאיש משה עניו מאד (במדבר י'ב ל'ג). איזהו עשיר שבעשירים זה ששמח בחלקו שנאמר יגיע כפיך כי תאכל אשריך וטוב לך (תהלים קכ'ח א'). איזהו גבור שבגבורים זהו הכובש את יצרו שנאמר טוב ארך אפים מגבור ומושל ברוחו מלוכד עיר (משלי ט'ז ל'ג) וכל הכובש את יצרו מעלין עליו כאלו כבש עיר מלאה גבורים שנאמר עיר גבורים עלה חכם [ויורד עוז מבטחה] (שם כ'א כ'ב) ואין גבורים אלא גבורי תורה שנאמר גבורי כח עושי דברו [לשמוע בקול דברו] (תהלים ק'ג כ'). ויש אומרים זה מלאכי השרת שנאמר מלאכיו גבורי כח (שם שם). ויש אומרים מי שעושה שונאו אוהבו: \r\n\r\n\r\nרבי נהוראי אומר הוי גולה למקום תורה ואל תאמר שהיא תבוא אחריך שחבירך יקיימוה בידך ואל בינתך אל תשען: \r\n\r\n\r\nהוא היה אומר אל תהי בז לכל אדם. ואל תהי מפליג לכל דבר שנאמר בז לדבר יחבל לו וירא מצוה הוא ישולם (משלי י'ג י'ג): \r\n\r\n\r\nהוא היה אומר הלמד תורה בילדותו למה הוא דומה לעגלה שכיבשוה כשהיא קטנה שנאמר ואפרים עגלה מלומדה אוהבתי לדוש (הושע י' יא). והלומד תורה בזקנותו דומה לפרה שלא כיבשוה אלא בזקנותה שנאמר כפרה סוררה סרר ישראל (שם ד' ט'ז): הוא היה אומר הלומד תורה בילדותו דומה לאשה שהיא לשה בחמין. והלומד תורה בזקנותו דומה לאשה שהיא לשה בצונן: רבי אליעזר בן יעקב אומר הלומד תורה בילדותו דומה לכתב שנכתב על נייר חדש. הלומד תורה בזקנותו דומה לכתב שנכתב על נייר ישן. רבן גמליאל מוסיף עליו הלומד תורה בילדותו דומה לבחור שנשא בתולה שהיא הוגנת לו הוא הגון לה והיא מתנפלת עליו והוא מתנפל עליה. הלומד תורה בזקנותו למה הוא דומה לזקן שנשא בתולה היא הוגנת לו והוא אינו הגון לה היא מתנפלת עליו והוא מתרחק ממנה שנאמר כחצים ביד גבור כן בני הנעורים וכתיב בתריה אשרי הגבר אשר מלא אשפתו מהם לא יבושו כי ידברו את אויבים בשער (תהלים קכ'ז ד' וה'). שונה ומשכח דומה לאשה שיולדת בנים וקוברת שנאמר כי אם יגדלו את בניהם ושכלתים מאדם (הושע ט' י'ב) אל תקרי ושכלתים אלא ושכחתים. רבי שמעון בן אלעזר אומר הלומד תורה בילדותו דומה לרופא שהביאו לפניו מכה ויש לו איזמל לחותכה וסמים לרפאותה. הלומד תורה בזקנותו דומה לרופא שהביאו לפניו מכה ויש לו איזמל לחותכה ואין לו סמים לרפאותה. אף כך דברי תורה יהיו מצויינין לך זה מזה ויהיו מצויינין לך זה בצד זה שנאמר קשרם על אצבעותיך כתבם על לוח לבך (משלי ז' ג') ואומר קשרם על לבך תמיד ענדם על גרגרותיך (שם ו' כ'א): \r\n",
                "בעי רב פפא: יש יד לקידושין או לא? היכי דמי? אילימא דאמר לה לאשה הרי את מקודשת לי, ואמר לחבירתה ואת נמי, פשיטא, היינו קידושין עצמן! אלא כגון דאמר לה לאשה הרי את מקודשת לי, ואמר לה לחבירתה ואת, מי אמרינן ואת נמי אמר לה לחבירתה, ותפסי בה קידושין לחבירתה, או דלמא ואת חזאי אמר לה לחבירתה, ולא תפסי בה קידושין בחבירתה? ומי מיבעי ליה לרב פפא? והא מדאמר ליה רב פפא לאביי: מי סבר שמואל ידים שאין מוכיחות הויין ידים? מכלל דסבירא ליה לרב פפא דיש יד לקידושין! חדא מגו מאי דסבירא ליה לשמואל אמר ליה לאביי. בעי רב פפא: יש יד לפאה, או אין יד לפאה? היכי דמי? אילימא דאמר הדין אוגיא ליהוי פאה והדין נמי, ההיא פיאה מעלייתא היא! כי קא מיבעיא ליה - כגון דאמר והדין ולא אמר נמי, מאי? מכלל דכי אמר שדה כולה תיהוי פאה הויא פאה! אין, והתניא: מנין שאם רוצה לעשות כל שדהו פאה עושה? ת'ל: +ויקרא יט+ פאת שדך; מי אמרינן כיון דאיתקש לקרבנות, מה קרבנות יש להם יד אף פאה יש לה יד, או דלמא כי איתקש - לבל תאחר הוא דאיתקש? והיכא איתקש? דתניא: ",
                " רבי יהודה אומר: לא מן השם הוא זה, אלא אמר קרא: +במדבר ה+ אותה, לבדה. ות'ק, הכתיב: אותה! ת'ק ר'ש היא, דדריש טעם דקרא, ומה טעם קאמר, מה טעם אותה לבדה? כדי שלא יהא לבה גס בחבירתה. מאי בינייהו? איכא בינייהו רותתת. ורותתת מי משקין? והא אין עושין מצות חבילות חבילות! דתנן: אין משקין שתי סוטות כאחת, ואין מטהרין שני מצורעין כאחת, ואין רוצעין שני עבדים כאחת, ואין עורפין שתי עגלות כאחת, לפי שאין עושין מצות חבילות חבילות! אמר אביי, ואיתימא רב כהנא, לא קשיא: כאן בכהן אחד, כאן בשני כהנים. "
        ];
        //UnknownTestClass
        var classData = SaveClassInterface; // {};
        InProgressService.updateIsReady(0);
        if (angular.equals(classData.actionMode, 'SelectOnlineCorpus')) {
            classData.select_RootKeys = SelectClassService.lastTestSetSelectedRootKeys;
        }
        classData.expType = 'Classification';
        APIService.apiGetArray({ crud: 'UnknownTestClassAsChunks' }, classData, function (response) {
            $scope.data.chunks = response;
            ParallelsService.updateChunks(response);
            $scope.parrallelsPerChunk = [];
            for (i = 0; i < ParallelsService.chunks.length; i = i + 1) {
                $scope.parrallelsPerChunk.push(
                    {
                        name: "Chunk " + i,
                        parallels: []
                    }
                );
            }
            CAPIService.apiRun({ crud: 'parallels' }, $scope.data, function (response2) {
                $scope.results = response2;
                $scope.groupNames = [];
                $scope.groups = [];
                $scope.numOfParallelsInGroups = [];
                $scope.numOfParallels = 0;
                for (k = 0; k < $scope.results.length; k = k + 1) {
                    var currentChunk = $scope.results[k];
                    $scope.numOfParallels += parseInt(currentChunk.numParallels);
                    for (j = 0; j < currentChunk.data.length; j = j + 1) {
                        var currentData = currentChunk.data[j];
                        var paths = currentData.compName.split(":");
                        var group = (paths[0] + " > " + paths[1]);
                        if ($scope.groupNames.indexOf(group) < 0) {
                            $scope.groupNames.push(group);
                            $scope.groups.push({
                                name: group,
                                numOfParallels: 1,
                                parallels: []
                            });
                        }
                        else {
                            $scope.groups[$scope.groupNames.indexOf(group)].numOfParallels += 1;
                        }
                        var title = paths[0];
                        for (i = 1; i < paths.length; i = i + 1) {
                            title += " > " + paths[i];
                        }

                        $scope.groups[$scope.groupNames.indexOf(group)].parallels.push({
                            chunkIndex: k,
                            chunkText: currentData.baseMatchedText,
                            parallelText: currentData.compMatchedText,
                            parallelTitle: title,
                            //startCharecterIndex: currentData.baseStartChar,
                            //length: currentData.baseTextLength
                        });
                        
                        $scope.parrallelsPerChunk[k].parallels.push(
                            {
                                chunkIndex: k,
                                chunkText: currentData.baseMatchedText,
                                parallelText: currentData.compMatchedText,
                                parallelTitle: title,
                            }
                        );

                    }
                }

                ParallelsService.updategroupNames($scope.groupNames);
                ParallelsService.updategroups($scope.groups);
                ParallelsService.updatenumOfParallelsInGroups($scope.numOfParallelsInGroups);
                ParallelsService.updatenumOfParallels($scope.numOfParallels);
                ParallelsService.updateparrallelsPerChunk($scope.parrallelsPerChunk);

                InProgressService.updateIsReady(1);
                $location.path('Tabs');
            });
        });
        
    }
    $scope.showInProcess = InProgressService.isReady != 1;
    $scope.$on('isReady_Updated', function () {
        $scope.showInProcess = InProgressService.isReady != 1;
    });


});

