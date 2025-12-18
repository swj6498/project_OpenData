function check_ok(){
	
	//비밀번호 정규식
	var passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/;
	//전화번호 정규식
	var phonRegex = /^0\d{1,2}-\d{3,4}-\d{4}$/;
	
	
	// 폼 이름에 name 값으로 찾아감
	if(reg_frm.user_id.value==""){
		alert("아이디를 써주세요.");
		reg_frm.user_id.focus();
		return;
	}
	if(reg_frm.user_id.value.length < 4){
		alert("아이디는 4글자이상이어야 합니다.");
		reg_frm.user_id.focus();
		return;
	}
	if(reg_frm.user_pw.value.length == 0){
		alert("패스워드는 반드시 입력해야 합니다.");
		reg_frm.user_pw.focus();
		return;
	}
	if (!passwordRegex.test(reg_frm.user_pw.value)) {
        alert("비밀번호는 8~16자, 영문자, 숫자, 특수문자를 모두 포함해야 합니다.");
        reg_frm.user_pw.focus();
        return;
    }

    // 비밀번호 일치 검사
    if (reg_frm.user_pw.value !== reg_frm.pwd_check.value) {
        alert("패스워드가 일치하지 않습니다.");
        reg_frm.pwd_check.focus();
        return;
    }
	
	if(reg_frm.user_name.value.length == 0){
		alert("이름을 써주세요.");
		reg_frm.user_name.focus();
		return;
	}
	if(reg_frm.user_email.value.length == 0){
		alert("Email을 써주세요.");
		reg_frm.user_email.focus();
		return;
	}
	
	if(reg_frm.user_phone_num.value.length == 0){
		alert("전화번호를 써주세요.");
		reg_frm.user_phone_num.focus();
		return;
	}
		
 	//전화번호가 000-0000-0000형식인지 확인
	if (!phonRegex.test(reg_frm.user_phone_num.value)) {
        alert("000-0000-0000형식으로 입력해주세요.");
        reg_frm.user_pw.focus();
        return;
    }

    // 약관 동의(필수) 체크 확인
    if (!document.getElementById("terms_required_service").checked) {
        alert("서비스 이용약관(필수)에 동의해야 회원가입이 가능합니다.");
        document.getElementById("terms_required_service").focus();
        return;
    }
    if (!document.getElementById("terms_required_privacy").checked) {
        alert("개인정보 처리방침(필수)에 동의해야 회원가입이 가능합니다.");
        document.getElementById("terms_required_privacy").focus();
        return;
    }
	
    if (!checkIdOk) {
        alert("아이디 중복 검사를 먼저 해주세요!");
        return;
    }
    
    if (!emailOk) {
        alert("이메일 인증을 완료해야 회원가입이 가능합니다!");
        return;
    }
	// 폼이 reg_frm에서 action 속성의 파일을 호출
	document.reg_frm.submit();
	alert("회원가입이 완료되었습니다!");
}

//우편번호 검색
function chk_post(){
	new daum.Postcode(
		{
			oncomplete : function(data) {
			   // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
	 
	           // 각 주소의 노출 규칙에 따라 주소를 조합한다.
	           // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
	           var fullAddr = ''; // 최종 주소 변수
	           var extraAddr = ''; // 조합형 주소 변수
	 
	           // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
	           if (data.userSelectedType === 'R') { // 도로명 주소
	               fullAddr = data.roadAddress;
	            } else { // 지번 주소
	                fullAddr = data.jibunAddress;
	            }
	 
	            // 도로명 타입일 때 조합형 주소 처리
	            if (data.userSelectedType === 'R') {
	                if (data.bname !== '') {
	                     extraAddr += data.bname;
	                }
	                if (data.buildingName !== '') {
	                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
	                }
	                fullAddr += (extraAddr !== '' ? ' (' + extraAddr + ')' : '');
	            }
	 
	            document.getElementById('user_post_num').value = data.zonecode;
	            document.getElementById('user_address').value = fullAddr;
	            document.getElementById('user_detail_address').focus();
	        }
	    }).open();
}

// 이메일 인증 코드 보내기
function sendAuthCode() {
	var emailRegex = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
    const email = document.getElementById("user_email").value;

    if(reg_frm.user_email.value.length==0){
		alert("Email을 써주세요.");
		reg_frm.user_email.focus();
		return;
	}
	if (!emailRegex.test(reg_frm.user_email.value)) {
        alert("메일형식으로 입력해주세요.");
        reg_frm.user_email.focus();
        return;
    }
    
    fetch("mail/send?email=" + email, { method: "POST" })
        .then(response => response.text())
        .then(result => {
        	if (result === "duplicate") {
                alert("이미 등록된 이메일입니다. 다른 이메일을 사용해주세요.");
                document.getElementById("user_email").focus();
                return;
            } else if (!isNaN(result)) {
                alert("인증번호가 전송되었습니다. (테스트용: " + result + ")");
                document.getElementById("user_email_chk").disabled = false;
                document.querySelector('[onclick="verifyAuthCode()"]').disabled = false;
            } else {
                alert("메일 전송 중 오류가 발생했습니다. (응답값: " + result + ")");
            }
        })
        .catch(error => {
            console.error("에러:", error);
            alert("메일 전송 중 오류가 발생했습니다.");
        });
}

// 이메일 인증번호 확인
function verifyAuthCode(){
	const authCode = document.getElementById("user_email_chk").value;
	
    if (reg_frm.user_email_chk.value.length == 0) {
        alert("인증번호를 써주세요.");
        reg_frm.user_email_chk.focus();
        return;
    }

    fetch("mail/verify?code=" + authCode, { method: "POST" })
        .then(response => response.text())
        .then(result => {
            if (result.trim() === "success") {
                alert("이메일 인증에 성공했습니다!");
                emailOk = true;
                document.getElementById("user_email_chk").disabled = true;
                document.querySelector('[onclick="sendAuthCode()"]').disabled = true;
                document.querySelector('[onclick="verifyAuthCode()"]').disabled = true;
                document.getElementById("register_btn").disabled = false;
            } else {
                alert("인증번호가 올바르지 않습니다.");
            }
        })
        .catch(error => {
            console.error("에러:", error);
            alert("서버 오류로 인증에 실패했습니다.");
        });
}

/** 약관 모달 열기 */
function showTerms(type) {
    const modal = document.getElementById("termsModal");
    const titleEl = document.getElementById("termsModalTitle");
    const textEl = document.getElementById("termsModalText");

    let title = "";
    let content = "";

    if (type === "service") {
        title = "서비스 이용약관";
        content = 
            "<h4>제1조 (목적)</h4>" +
            "<p>본 약관은 공공데이터를 활용한 대기질 정보 제공 서비스의 이용과 관련하여 필요한 사항을 규정합니다.</p>" +
            "<h4>제2조 (서비스의 제공)</h4>" +
            "<p>본 서비스는 환경부 실시간 대기질 정보를 공공데이터포털을 통해 제공합니다. 서비스 안정적인 제공을 위해 시스템 점검, 기능 변경 등이 이루어질 수 있습니다.</p>" +
            "<h4>제3조 (이용자의 의무)</h4>" +
            "<p>이용자는 타인의 정보를 도용하거나 서비스 운영을 방해하는 행위를 해서는 안 됩니다. 약관 위반 시 서비스 이용이 제한될 수 있습니다.</p>";
    } else if (type === "privacy") {
        title = "개인정보 처리방침";
        content = 
            "<h4>1. 수집하는 개인정보 항목</h4>" +
            "<p>아이디, 비밀번호, 이름, 이메일, 연락처, 주소 등 회원가입에 필요한 정보를 수집합니다.</p>" +
            "<h4>2. 개인정보의 이용 목적</h4>" +
            "<p>대기질 정보 제공, 회원 관리, 문의 응대, 서비스 개선을 위해 사용됩니다.</p>" +
            "<h4>3. 개인정보의 보유 및 이용 기간</h4>" +
            "<p>관련 법령에서 정한 기간 동안 보관 후 안전하게 파기합니다.</p>" +
            "<h4>4. 이용자의 권리</h4>" +
            "<p>이용자는 개인정보 열람·정정·삭제를 요청할 수 있으며, 마이페이지에서 직접 처리하실 수 있습니다.</p>";
    } else if (type === "optional") {
        title = "대기질 관련 공지 및 서비스 안내 수신 동의 (선택)";
        content = 
            "<h4>수신 동의 내용</h4>" +
            "<p>대기질 경보, 서비스 점검, 기능 업데이트 등과 같은 안내를 이메일 등으로 받아볼 수 있습니다.</p>" +
            "<h4>선택 항목 안내</h4>" +
            "<p>본 항목은 선택 사항으로, 동의하지 않아도 기본 서비스 이용에는 제한이 없습니다.</p>" +
            "<h4>동의 철회</h4>" +
            "<p>수신 동의는 마이페이지 또는 고객센터를 통해 언제든지 변경·철회할 수 있습니다.</p>";
    }

    titleEl.textContent = title;
    textEl.innerHTML = content;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden"; // 배경 스크롤 방지
}

/** 약관 모달 닫기 */
function closeTermsModal() {
    const modal = document.getElementById("termsModal");
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // 스크롤 복원
}
