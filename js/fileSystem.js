
/*  실행중 오류 발생시 호출될 콜백함수 */

function errorCallback(error) {

  var message = '';



  switch (error.message) {

    case FileError.SECURITY_ERR:

      message = 'Security Error';

      break;

    case FileError.NOT_FOUND_ERR:

      message = 'Not Found Error';

      break;

    case FileError.QUOTA_EXCEEDED_ERR:

      message = 'Quota Exceeded Error';

      break;

    case FileError.INVALID_MODIFICATION_ERR:

      message = 'Invalid Modification Error';

      break;

    case FileError.INVALID_STATE_ERR:

      message = 'Invalid State Error';

      break;

    default:

      message = 'Unknown Error';

      break;

  }

  //console.log(message);

  printMsg(message);

}



var filesystem = null;



/* 현재 브라우저가 FileSystem API를 지원하는지 확인하는 함수 */

function checkFileSystem() {
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    if(window.requestFileSystem) {
        printMsg("FileSystem을 지원하는 브라우저입니다");
    }
    else {
       printMsg("FileSystem을 지원하지 않는 브라우저입니다");
    }
}



/* FileSystem API 가 임시저장소 기능을 지원하는지 확인 */

function checkTempFileSystem() {

	window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;



	// Request a FileSystem (임시 저장소, 브라우저가 임의로 삭제 가능한 저장소 요청)

	window.requestFileSystem(window.TEMPORARY, 1024 * 1024, 

	  function(filesystem) {

		   //console.log("임시저장소 기능을 지원하는 브라우저입니다");

		   printMsg("임시저장소 기능을 지원하는 브라우저입니다");

	  },

	  function(error) {

		   //console.log("임시저장소 기능을 지원하지 않는 브라우저입니다");

		   printMsg("임시저장소 기능을 지원하지 않는 브라우저입니다");

	  }

	);

}



/* FileSystem API 가 영구저장소 기능을 지원하는지 확인 */

function checkPerFileSystem() {

	// 브라우저가 임의로 삭제하지 않는 영구 저장소 요청의 경우

	window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

	navigator.webkitPersistentStorage.requestQuota(

		1024 * 1024 * 10,

		function(grantedSize) {



			// Request a file system with the new size.

			window.requestFileSystem(window.PERSISTENT, grantedSize, 

				function(fs) {

					filesystem = fs;

					//console.log("대용량 영구 저장소 요청성공");

					printMsg("대용량 영구 저장소 요청성공");

					 // Do something with your new (larger) fs

					//console.log('Opened file system: ' + fs.name);

					//printMsg('Opened file system: ' + fs.name);

				 },

				 errorCallback

			 );

		},

		errorCallback

	);

}



/*  로컬 시스템상에 파일을 생성함 */

function createLocalFile() {

    filesystem.root.getFile('log.txt', {create: true, exclusive: true}, 

       function(fileEntry) {

          //console.log("생성된 파일의 절대경로", fileEntry.fullPath);

          printMsg("생성된 파일의 절대경로" + fileEntry.fullPath);

       }, 

	   errorCallback 

	);

}



/* 로컬 시스템상의 파일에 쓰기 */

function writeLocalFile() {

	filesystem.root.getFile('log.txt', {create: true, exclusive: false}, 

	   function(fileEntry) {

		 // console.log("파일의 절대경로", fileEntry.fullPath);

		 printMsg("C:\\", fileEntry.fullPath);

		  // Create a FileWriter object for our FileEntry (log.txt).

		  fileEntry.createWriter(function(fileWriter) {

			  //console.log("FileWriter 생성 성공");

			  printMsg("FileWriter 생성 성공");

			  fileWriter.onwriteend = function(e) { //파일에 쓰기 성공 이벤트

				//console.log('파일쓰기 성공.');

				printMsg('파일쓰기 성공.');

			  };



			  fileWriter.onerror = function(e) { //파일에 쓰기 실패 이벤트

				//console.log('파일쓰기 실패: ' + e.toString());

				printMsg('파일쓰기 실패: ' + e.toString());

			  };



			  var blob = new Blob(['사랑합니다 and\n감사합니다'], {type: 'text/plain'}, 'utf-8');

			  fileWriter.write(blob);

			  //fileWriter.seek(0);

		  }, errorCallback); // fileWriter생성 성공/실패 이벤트 끝



	   }, errorCallback ); // getFile() 성공/실패 이벤트 끝

}



/* 로컬 시스템상의 파일로부터 읽어오기 */

function readLocalFile() {

	// 파일 읽기

	filesystem.root.getFile('log.txt', {}, function(fileEntry) {

		//console.log("파일 읽기 위해 열기 성공");

		printMsg("파일 읽기 위해 열기 성공");

		// Get a File object representing the file,

		// then use FileReader to read its contents.

		fileEntry.file( function(file) { //파일 오브젝트를 구함, 성공 이벤트

			//console.log("파일 오브젝트 구하기 성공");

			printMsg("파일 오브젝트 구하기 성공");

			var reader = new FileReader();



			reader.onloadend = function(e) {

				//console.log("파일읽기 내용:"+this.result );

				printMsg("파일읽기 내용:"+this.result );

			};



			reader.readAsText(file, 'utf-8');



		}, errorCallback); // 파일 오브젝트 얻기(file()) 성공/실패 이벤트 끝

	}, errorCallback); // getFile 성공/실패 이벤트 끝

	// 파일 읽기 끝

}



/* 로컬 시스템상의 파일삭제 */

function removeLocalFile() {

	filesystem.root.getFile('log.txt', {create: false, exclusive: false}, 

		function(fileEntry) {

			//console.log("삭제할 파일의 절대경로", fileEntry.fullPath);

			printMsg("삭제할 파일의 절대경로", fileEntry.fullPath);

			fileEntry.remove( function() { //삭제성공 이벤트

				//console.log('파일삭제 성공');

				printMsg('파일삭제 성공');

			}, errorCallback );

		}, errorCallback 

	);

}



/* 위의 함수들이 실행될 때 메시지를 화면에 출력하는 함수 */

function printMsg(str) {

    console.log(str);

}