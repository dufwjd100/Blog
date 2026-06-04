/*************************************************
 * 기간 요약 블로그 자동화 (v9.0 Integrated + 사진태깅)
 * - v8.0 안정 버전 위에 "사진태깅" 탭 연동을 통합
 * - 사진 선택은 사진태깅 탭 우선, 후보 없으면 Drive 폴더 폴백
 * - 지점값(수원/안양), 사진유형(대표이미지/클로즈업/공간사진 등) 실제값 기준 매칭
 * - 모델은 gpt-4o-mini 유지
 **************************************************/

/* ========= CONFIG ========= */
const CONFIG = {
  ANYANG: {
    branchKey: 'ANYANG',
    city: '안양',
    sourceSpreadsheetId: '1QOp8T83xyyBHt_BU3RAbytcqeVrEuHB3nED6zeLw_d4', // 안양점 동경하다 V.2 (페이 자동계산)
    sourceSheetName: '출석부',
    sheetId: '1SS74VANMD6Kxw2qNjrqEHTDhSRMRuF0wi9AQoqYa8Ac',
    targetSheetName: '안양_v8',
    imageRootFolderId: '1knpnO4MJGNaCEz7pNEOe02yLGq1mG13b',
    headerRow: 1,
    timezone: 'Asia/Seoul',
    platformDefault: '네이버블로그',
    scheduleDefault: '',
    model: 'gpt-4o-mini',
    temperature: 0.75,
    max_tokens: 1800,
    partRotation: ['기타', '베이스기타', '드럼', '피아노'],
    localLabels: ['비산동 ', '평촌 ', '범계 ', '관양동 ', '호계동 ', '인덕원 '],
    cityHashtags: [
      '#안양실용음악학원', '#안양입시음악학원', '#안양음악학원',
      '#평촌실용음악', '#범계실용음악', '#관양실용음악', '#호계실용음악', '#비산실용음악',
      '#평촌드럼학원', '#범계드럼학원', '#관양동드럼학원', '#호계동드럼학원', '#비산동드럼학원'
    ],
    trialCTA: {
      mapUrl: 'https://naver.me/58NiByBR',
      kakaoUrl: 'https://pf.kakao.com/_ESscxj',
      phone: '0507-1306-6508',
      address: '경기 안양시 동안구 관악대로 91 대림타워 801호',
      booking: {
        '피아노': 'https://m.booking.naver.com/booking/10/bizes/876672/items/5018128?theme=place&service-target=map-pc&lang=ko&area=bmp&map-search=1',
        '드럼': 'https://m.booking.naver.com/booking/10/bizes/876672/items/5018095?theme=place&service-target=map-pc&lang=ko&area=bmp&map-search=1',
        '기타': 'https://m.booking.naver.com/booking/10/bizes/876672/items/5097730?theme=place&service-target=map-pc&lang=ko&area=bmp&map-search=1',
        '베이스기타': 'https://m.booking.naver.com/booking/10/bizes/876672/items/5097730?theme=place&service-target=map-pc&lang=ko&area=bmp&map-search=1'
      }
    }
  },
  SUWON: {
    branchKey: 'SUWON',
    city: '수원',
    sourceSpreadsheetId: '1QHrIr76dBf49rDWrN2I5IVaZgAZSi8tAScNRW0SRxt4', // NEW 수원점 동경하다 V.2 (페이 자동계산)
    sourceSheetName: '출석부',
    sheetId: '1SS74VANMD6Kxw2qNjrqEHTDhSRMRuF0wi9AQoqYa8Ac',
    targetSheetName: '수원_v8',
    imageRootFolderId: '1knpnO4MJGNaCEz7pNEOe02yLGq1mG13b',
    headerRow: 1,
    timezone: 'Asia/Seoul',
    platformDefault: '네이버블로그',
    scheduleDefault: '',
    model: 'gpt-4o-mini',
    temperature: 0.75,
    max_tokens: 1800,
    partRotation: ['기타', '베이스기타', '드럼', '피아노', '보컬', '작곡', '미디'],
    localLabels: ['수원 ', '영통 ', '매탄동 ', '권선동 ', '인계동 ', '세류동 ', '광교 ', '매교동 ', '매탄권선역 ', '영통구청 '],
    cityHashtags: [
      '#매탄동실용음악학원', '#영통실용음악학원', '#영통구청실용음악학원',
      '#권선동실용음악학원', '#인계동실용음악학원', '#세류동실용음악학원', '#광교실용음악학원', '#매교동실용음악학원'
    ],
    trialCTA: {
      mapUrl: 'https://naver.me/GnRiX1Ko',
      kakaoUrl: 'https://pf.kakao.com/_ESscxj',
      phone: '0507-1418-6659',
      address: '경기도 수원시 영통구 효원로 383 매탄프라자 7층 701호',
      booking: {
        '보컬': 'https://m.booking.naver.com/booking/10/bizes/1236008/items/6191103?theme=place&service-target=map-pc&lang=ko&area=bmp&map-search=1',
        '기타': 'https://m.booking.naver.com/booking/10/bizes/1236008/items/6191103?theme=place&service-target=map-pc&lang=ko&area=bmp&map-search=1',
        '베이스기타': 'https://m.booking.naver.com/booking/10/bizes/1236008/items/6191103?theme=place&service-target=map-pc&lang=ko&area=bmp&map-search=1',
        '드럼': 'https://m.booking.naver.com/booking/10/bizes/1236008/items/6191103?theme=place&service-target=map-pc&lang=ko&area=bmp&map-search=1',
        '피아노': 'https://m.booking.naver.com/booking/10/bizes/1236008/items/6191103?theme=place&service-target=map-pc&lang=ko&area=bmp&map-search=1',
        '작곡': 'https://m.booking.naver.com/booking/10/bizes/1236008/items/6191103?theme=place&service-target=map-pc&lang=ko&area=bmp&map-search=1',
        '미디': 'https://m.booking.naver.com/booking/10/bizes/1236008/items/6191103?theme=place&service-target=map-pc&lang=ko&area=bmp&map-search=1'
      }
    }
  }
};

/* ========= v8.4: 브로슈어 스타일 ========= */
const DOC_STYLE = {
  fontHeading: 'Nanum Myeongjo',
  fontBody: 'Noto Sans KR',
  colorHeading: '#6B4226',
  colorAccent: '#B5612E',
  colorBody: '#3D3128',
  sizeH1: 22,
  sizeH2: 16,
  sizeBody: 11
};

const DOC_EXPORT_MODE = 'LINK_ONLY';

/* ========= 메뉴 / 진입점 ========= */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('블로그 자동화(v9.0)')
    .addItem('안양 기간 요약 글 생성', 'menuRunAnyang')
    .addItem('수원 기간 요약 글 생성', 'menuRunSuwon')
    .addSeparator()
    .addItem('선택한 행을 Google Docs로 내보내기', 'menuExportSelectedToDocs')
    .addSeparator()
    .addItem('OpenAI 키 설정', 'run_setOpenAIKey')
    .addToUi();
}

function menuRunAnyang() { menuGenerateByBranch_('ANYANG'); }
function menuRunSuwon() { menuGenerateByBranch_('SUWON'); }

function runAnyang() { generatePeriodSummaries_('ANYANG', '', '', ''); }
function runSuwon() { generatePeriodSummaries_('SUWON', '', '', ''); }

function menuGenerateByBranch_(branchKey) {
  const ui = SpreadsheetApp.getUi();
  const s = ui.prompt('시작일 (예: 2025-10-01, 비우면 자동)').getResponseText().trim();
  const e = ui.prompt('종료일 (예: 2025-10-31, 비우면 자동)').getResponseText().trim();
  const p = ui.prompt('파트 필터(비우면 로테이션 자동)').getResponseText().trim();
  generatePeriodSummaries_(branchKey, s, e, p);
}

/* ========= OpenAI KEY ========= */
function run_setOpenAIKey() { setOpenAIKey_(); }

function setOpenAIKey_() {
  const ui = SpreadsheetApp.getUi();
  const resp = ui.prompt('OpenAI API Key (sk- 로 시작):').getResponseText().trim();
  if (!/^sk-/.test(resp)) {
    ui.alert('❗ 키 형식이 올바르지 않습니다.');
    return;
  }
  PropertiesService.getScriptProperties().setProperty('OPENAI_API_KEY', resp);
  ui.alert('✅ OpenAI API Key 저장 완료');
}

function getOpenAIKey_() {
  const key = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
  if (!key) throw new Error('OPENAI_API_KEY가 설정되지 않았습니다.');
  return key;
}

/* ========= 메인 로직 ========= */
function generatePeriodSummaries_(branchKey, startStr, endStr, partFilter) {
  const cfg = getCfg_(branchKey);

  const srcSS = openSourceSpreadsheet_(cfg);
  const src = srcSS.getSheetByName(cfg.sourceSheetName);
  if (!src) throw new Error(`소스 시트(${cfg.sourceSheetName})가 없습니다.`);

  const dstSS = SpreadsheetApp.openById(cfg.sheetId);
  let dst = dstSS.getSheetByName(cfg.targetSheetName);
  if (!dst) dst = dstSS.insertSheet(cfg.targetSheetName);
  ensureTargetHeader_(dst);

  const lastRow = src.getLastRow();
  const lastCol = src.getLastColumn();
  if (lastRow < cfg.headerRow) {
    safeNotify_('출석부에 데이터가 없습니다.');
    return;
  }

  const data = src.getRange(cfg.headerRow, 1, lastRow - cfg.headerRow + 1, lastCol).getValues();
  if (data.length < 2) {
    safeNotify_('출석부 데이터가 부족합니다.');
    return;
  }

  const header = data[0].map(String);
  const rows = data.slice(1);
  const col = buildColumnIndex_(header);

  const tz = cfg.timezone;
  let start, end;
  if (startStr && endStr) {
    start = parseDate_(startStr, tz, '시작일 형식은 YYYY-MM-DD');
    end = parseDate_(endStr, tz, '종료일 형식은 YYYY-MM-DD');
  } else {
    const inferred = inferPeriodAuto_(rows, col, tz);
    start = inferred.start;
    end = inferred.end;
  }

  const endPlus = new Date(end.getTime());
  endPlus.setDate(endPlus.getDate() + 1);

  const manualPart = Boolean(partFilter && partFilter.trim());
  let selectedPart = manualPart ? normalizePart_(partFilter.trim()) : '';
  let pack = null;

  if (manualPart) {
    pack = collectLessonPackForPart_(cfg, rows, col, selectedPart, start, endPlus);
  } else {
    for (let i = 0; i < cfg.partRotation.length; i++) {
      const candidatePart = getNextPartRotation_(cfg);
      const candidatePack = collectLessonPackForPart_(cfg, rows, col, candidatePart, start, endPlus);
      if (candidatePack.text.length) {
        selectedPart = candidatePart;
        pack = candidatePack;
        break;
      }
      Logger.log(`글감 없음: ${cfg.city} ${candidatePart} → 다음 파트 시도`);
    }
  }

  if (!pack || !pack.text.length) {
    if (manualPart) safeNotify_(`선택된 파트(${selectedPart})에 해당 기간 글감이 없습니다.`);
    else Logger.log(`${cfg.city}: 전체 파트 로테이션을 확인했지만 해당 기간 글감이 없습니다.`);
    return;
  }

  const local = pickLocalLabel_(cfg);
  const target = pickTarget_();
  const titleType = pickTitleType_();
  const uniqSongs = [...new Set(pack.songs)].slice(0, 5);
  const songForTitle = uniqSongs[0] || '';
  const dateRangeLabel = `${Utilities.formatDate(start, tz, 'yyyy.MM.dd')} ~ ${Utilities.formatDate(end, tz, 'yyyy.MM.dd')}`;
  const periodLabel = `${Utilities.formatDate(start, tz, 'yyyy.M')}~${Utilities.formatDate(end, tz, 'yyyy.M')}`;
  const recentFaqs = getRecentFaqs_(dst, 5);

  // v9.0 변경: 사진태깅 탭에서 먼저 사진을 선택하고, 그 태깅 정보를 GPT에 함께 넘긴다.
  const selectedImages = selectTaggedPhotosForPost_(dstSS, cfg, selectedPart, 10);

  const g = generateWithGPT_V8_(cfg, selectedPart, pack.text, {
    city: cfg.city,
    localLabel: local,
    dateRange: dateRangeLabel,
    songs: uniqSongs,
    target: target,
    titleType: titleType,
    recentFaqs: recentFaqs,
    photoTags: selectedImages
  });

  if (!g || !g.title || !g.sections || !Array.isArray(g.faq) || g.faq.length < 3) {
    appendObjectRows_(dst, [emptyObjectWithError_(selectedPart, start, end, tz, `GPT생성실패: ${(g && g.error) || 'unknown'}`)]);
    return;
  }

  const forbiddenNames = [...pack.students, ...pack.teachers].filter(Boolean);
  const sections = scrubSections_(normalizeSections_(g.sections), forbiddenNames);
  const faq = scrubFaq_(normalizeFaq_(g.faq).slice(0, 3), forbiddenNames);
  const studioIntro = getStudioIntro_();
  const cta = trialCTA_(cfg, selectedPart);

  let body = [
    sections.intro,
    sections.body,
    '[실제 수업 한 장면]',
    sections.case,
    '[자주 묻는 질문]',
    faqToText_(faq),
    '[학원 소개]',
    studioIntro,
    cta
  ].filter(Boolean).join('\n\n');

  if (body.length < 1500 || body.length > 2200) {
    try { body = resizeBodyWithGPT_(cfg, body, 1800); } catch (e) { Logger.log(e); }
  }
  body = scrubKnownNames_(body, forbiddenNames);

  if (isDuplicateAcrossBranches_(body)) {
    try {
      body = resizeBodyWithGPT_(cfg, body + '\n\n같은 의미를 유지하면서 문장과 흐름을 완전히 다르게 다시 써줘.', 1200);
      body = scrubKnownNames_(body, forbiddenNames);
    } catch (e) {
      Logger.log('리라이트 실패: ' + e);
    }
  }

  const titleTail = titleType === 'KEYWORD'
    ? cleanupTitle_(g.title, local, selectedPart)
    : scrubKnownNames_(String(g.title || '').replace(/\s+/g, ' ').trim(), forbiddenNames);
  const seoTitleFull = buildFinalTitle_(titleType, titleTail, local, selectedPart);

  const tagsArr = buildSeoHashtags_({
    cfg: cfg,
    city: cfg.city,
    part: selectedPart,
    song: songForTitle,
    period: periodLabel,
    localLabel: local.trim()
  });
  const tagsLine = tagsArr.join(' ');
  const tagsCsv = tagsArr.join(',');
  const photoCaps = Array.isArray(g.photo_captions)
    ? g.photo_captions.slice(0, 10).map(c => scrubKnownNames_(c, forbiddenNames))
    : [];
  const thumbnailInfo = normalizeThumbnailInfo_(g.thumbnail_info, {
    title: seoTitleFull,
    city: cfg.city,
    part: selectedPart,
    target: target
  });

  const uploadFolder = createUploadImageFolder_(cfg, selectedPart, selectedImages, {
    title: seoTitleFull,
    date: new Date(),
    timezone: tz
  });
  const photoGuide = buildPhotoRecommendationGuide_(cfg, selectedPart, selectedImages);

  const finalPaste = assembleFinal_({
    title: seoTitleFull,
    part: selectedPart,
    city: cfg.city,
    localLabel: local,
    thumbnailInfo: thumbnailInfo,
    photoGuide: photoGuide,
    uploadFolder: uploadFolder,
    sections: sections,
    faq: faq,
    studioIntro: studioIntro,
    cta: cta,
    photoCaptions: photoCaps,
    hashtagsLine: tagsLine
  });

  const row = {
    'post_id': genPostId_(selectedPart, new Date(), tz),
    '상태': '생성됨',
    '발행플랫폼': cfg.platformDefault || '',
    '발행URL': '',
    '예약시간': cfg.scheduleDefault || '',
    '본문(복붙)': finalPaste,
    '제목': seoTitleFull,
    '해시태그': tagsCsv,
    '섹션-도입': sections.intro,
    '섹션-본문': sections.body,
    '섹션-사례': sections.case,
    '섹션-FAQ': faqToText_(faq),
    'FAQ_JSON': JSON.stringify(faq),
    '섹션-학원소개': studioIntro,
    '섹션-CTA': cta,
    '본문_MD': body,
    '썸네일_아이디어': scrubKnownNames_(g.thumbnail_idea || '', forbiddenNames),
    '썸네일_제작정보': thumbnailInfoToText_(thumbnailInfo),
    '사진추천_조건': photoGuideToText_(photoGuide),
    '이미지_URLs': selectedImages.map(img => img.url).join(' | '),
    '업로드용_사진폴더': uploadFolder.url,
    '업로드용_사진목록': uploadFolder.fileNames.join('\n'),
    '학생명': '',
    '수업일': `${Utilities.formatDate(start, tz, 'yyyy-MM-dd')}~${Utilities.formatDate(end, tz, 'yyyy-MM-dd')}`,
    '파트/악기': selectedPart,
    '타겟': target,
    '클래스': '',
    '강사명': [...pack.teachers].join(', '),
    '원본행': JSON.stringify(pack.rowNums),
    '에러로그': '',
    '사진캡션(CSV)': photoCaps.join(' | ')
  };

  appendObjectRows_(dst, [row]);
  markTaggedPhotosUsed_(dstSS, selectedImages, seoTitleFull, tz);
  safeNotify_(`기간 요약 1건 생성 완료: ${seoTitleFull}`);
}

/* ========= GPT 생성부 (v8.0 Q&A 친화 구조 + 사진태깅) ========= */
function generateWithGPT_V8_(cfg, part, textList, meta) {
  const key = getOpenAIKey_();
  const url = 'https://api.openai.com/v1/chat/completions';

  const cleaned = (textList || [])
    .map(t => String(t || '').replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  const seed = pickDiverseSeedLines_(cleaned, 6).join('\n');

  const titleGuide = [
    '생성 순서: 1) 출석부/레슨평가에서 수업 핵심 1줄 추출 2) 그 핵심을 검색자가 물을 법한 질문으로 변환 3) 질문형 제목 작성 4) 본문 작성 5) FAQ 작성.',
    'GPT title은 질문 부분만 작성한다. 예: "직장인 발성 수업은 음역 연결을 어떻게 연습할까요?"',
    '최종 제목에는 코드가 지역+파트학원 키워드를 앞에 붙이므로 title 안에는 지역명, 동네명, 학원, 레슨을 반복하지 않는다.',
    '질문은 수업내용에서 나온 실제 패턴을 바탕으로 만든다.'
  ].join('\n');

  const system = [
    '너는 실용음악학원 블로그를 쓰는 상업용 카피라이터이자 SEO 에디터다.',
    '목표: AI와 검색이 인용하기 쉬운 질문형/FAQ형/수업사례형 블로그 글을 꾸준히 생성한다.',
    '톤: 따뜻하고 담백하게. 과장 없이 정보와 사실을 1~2개 이상 포함한다.',
    '금지어: 최고, 1등, 무조건, 보장, 100%',
    '학생/강사의 실명, 성, 이름, 초성, 이니셜, 마스킹명은 제목/본문/FAQ/사진캡션 어디에도 절대 쓰지 않는다.',
    '학생을 지칭할 때는 반드시 "한 학생", "한 초등학생", "한 성인 수강생", "한 수강생" 같은 비식별 표현만 쓴다.',
    '여러 출석부 행을 묶은 주간 요약형 글이므로 특정 학생 개인의 후기처럼 쓰지 않는다.',
    '구성은 반드시 intro/body/case/faq 3개로 만든다. empathy/core/detail/diff/cta 구조를 쓰지 않는다.',
    'intro는 초보자/학부모/성인 수강생의 걱정으로 시작하는 공감 도입으로 쓴다.',
    'body에는 "설명만 듣는 수업"보다 "직접 해보고, 다시 확인하고, 조금씩 자기 것으로 만드는 수업"이라는 메시지를 자연스럽게 포함한다.',
    'case는 추상적 감상보다 수업에서 실제로 무엇을 했는지 중심으로 쓴다.',
    'case에는 가능한 경우 "느린 템포에서 시작", "원래 템포로 올림", "8마디 연결", "곡 전체 흐름", "리듬과 템포를 나누어 연습" 같은 구체적 행동을 포함한다.',
    'FAQ 우선순위: 1) 수업내용 기반 질문 2) 학부모/수강생이 실제로 할 만한 질문 3) 일반 검색 질문.',
    'FAQ는 본문과 연결된 질문만 만들고, 최근 질문 목록과 겹치는 질문은 피한다.',
    'FAQ 답변은 검색자가 바로 이해할 수 있게 2~4문장으로 쓴다.',
    '출력은 JSON 객체 1개만 반환한다. JSON 외 텍스트 금지.',
    `도시: ${meta.city}`,
    `지역라벨: ${meta.localLabel}`,
    `파트: ${part}`,
    `타겟: ${meta.target}`,
    `기간: ${meta.dateRange}`,
    titleGuide,
    buildTargetGuide_(meta.target),
    buildFaqCategoryGuide_(part)
  ].join('\n');

  const userPrompt = [
    '아래 수업곡/수업내용/레슨평가/현재진행상태에서 수업 패턴과 정보성 포인트를 뽑아 글을 작성해라.',
    '먼저 lesson_core에 수업 핵심을 1줄로 추출하고, title은 lesson_core를 질문으로 바꾼 문장으로 작성해라.',
    '본문 전체에 지역라벨과 도시+파트학원 표현을 자연스럽게 2~4회 포함하라.',
    '사례 문단은 "성장했다/좋았다"만 쓰지 말고 어떤 연습을 어떤 순서로 했는지 적어라.',
    'FAQ 3개 중 최소 2개는 수업곡/수업내용/레슨평가/현재진행상태에서 나온 실제 수업 패턴을 질문으로 바꿔라.',
    '사진 캡션에도 학생명/강사명/초성/이니셜을 쓰지 마라.',
    '',
    '최근 5개 글 FAQ. 이 질문들은 피할 것:',
    (meta.recentFaqs || []).map(q => `- ${q}`).join('\n') || '- 없음',
    '',
    '이번 글에 사용할 사진태깅 참고 정보:',
    formatPhotoTagsForPrompt_(meta.photoTags),
    '',
    '사진 캡션, 썸네일 배경 추천, 본문 사진 추천 문구는 반드시 위 사진태깅 정보의 사진유형/핵심내용/추천_글내위치/태깅비고를 참고해서 작성하라.',
    '사진유형은 블로그에서의 배치 역할로 보고, 핵심내용과 파일명해석은 실제 사진 내용으로 함께 참고하라.',
    '사진태깅 정보에 "클로즈업", "수업장면", "연습실", "로비", "브랜드" 같은 맥락이 있으면 캡션에 그 용도를 자연스럽게 반영하라.',
    '단, 사진 속 인물의 이름이나 특정 학생을 추정하는 표현은 쓰지 마라.',
    '',
    '수업곡/수업내용/레슨평가/현재진행상태 발췌:',
    seed,
    '',
    '반드시 다음 JSON 구조로 반환:',
    JSON.stringify({
      lesson_core: '수업 핵심 1줄',
      title: '...',
      sections: {
        intro: '공감 도입 문단',
        body: '초보자의 고민과 동경하다 수업 방식 설명 문단',
        case: '구체적인 수업 행동 중심의 실제 수업 한 장면 문단'
      },
      faq: [
        { q: '질문 1', a: '답변 1' },
        { q: '질문 2', a: '답변 2' },
        { q: '질문 3', a: '답변 3' }
      ],
      photo_captions: ['사진 1 캡션','사진 2 캡션','사진 3 캡션','사진 4 캡션','사진 5 캡션','사진 6 캡션','사진 7 캡션','사진 8 캡션','사진 9 캡션','사진 10 캡션'],
      thumbnail_idea: '...',
      thumbnail_info: {
        template_type: 'Q&A형',
        background_photo: '악기/수업/공간 사진 추천',
        title_main: '메인 문구',
        title_sub: '서브 문구',
        brand_name: '음악실 동경하다',
        tone: '따뜻함, 차분함, 초보자 친화'
      }
    })
  ].join('\n');

  const payload = {
    model: cfg.model,
    temperature: cfg.temperature,
    max_tokens: cfg.max_tokens,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: userPrompt }
    ]
  };

  const res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: `Bearer ${key}` },
    muteHttpExceptions: true,
    payload: JSON.stringify(payload)
  });

  const code = res.getResponseCode();
  if (code < 200 || code >= 300) {
    return { error: `HTTP ${code}: ${(res.getContentText() || '').slice(0, 600)}` };
  }

  const json = JSON.parse(res.getContentText());
  const raw = (json.choices?.[0]?.message?.content || '').trim();
  try {
    return JSON.parse(raw);
  } catch (e) {
    return { error: 'JSON 파싱 실패: ' + e + ' / raw: ' + raw.slice(0, 300) };
  }
}

/* ========= 제목 타입 / FAQ / 학원 소개 ========= */
function pickTitleType_() {
  // QUESTION 고정 해제. 제목 패턴 반복을 줄이기 위해 순환한다.
  const types = ['QUESTION', 'QUESTION', 'KEYWORD'];
  const i = getAndBumpCounter_('TITLE_TYPE_IDX', types.length);
  return types[i];
}

function buildFinalTitle_(titleType, titleTail, local, part) {
  const localClean = String(local || '').trim();
  const partClean = String(part || '').trim();
  const prefix = `${localClean} ${partClean}학원`.replace(/\s+/g, ' ').trim();
  let tail = cleanupTitle_(titleTail, localClean, partClean);

  if (titleType === 'QUESTION') {
    tail = tail.replace(/[?？]*$/, '').trim();
    return `${prefix}, ${tail}?`.replace(/\s+/g, ' ').trim();
  }

  return `${prefix} ${tail}`.replace(/\s+/g, ' ').trim();
}

function buildFaqCategoryGuide_(part) {
  const p = normalizePart_(part);
  const map = {
    '드럼': 'FAQ 후보 범주: 시작연령, 층간소음, 드럼세트, 기본기, 곡 시작 시기',
    '기타': 'FAQ 후보 범주: 통기타와 일렉기타 차이, 손가락 통증, 코드, 곡 시작 시기, 독학 비교',
    '베이스기타': 'FAQ 후보 범주: 기타와 차이, 시작 시기, 합주, 곡 시작 시기',
    '피아노': 'FAQ 후보 범주: 시작 연령, 클래식과 실용 차이, 손가락, 곡 시작 시기, 성인 가능',
    '보컬': 'FAQ 후보 범주: 음치, 발성, 곡 선정, 변성기, 호흡',
    '작곡': 'FAQ 후보 범주: 시작 시기, 장비, DAW, 화성학',
    '미디': 'FAQ 후보 범주: 시작 시기, 장비, DAW, 화성학'
  };
  return map[p] || 'FAQ 후보 범주: 시작 시기, 준비물, 기초, 곡 시작 시기, 수업 방식';
}

function getRecentFaqs_(dst, limit) {
  try {
    const headerMap = getHeaderMap_(dst);
    const faqCol = headerMap['FAQ_JSON'];
    if (!faqCol || dst.getLastRow() < 2) return [];

    const n = Math.min(limit || 5, dst.getLastRow() - 1);
    const start = Math.max(2, dst.getLastRow() - n + 1);
    const values = dst.getRange(start, faqCol, n, 1).getValues();
    const out = [];
    values.forEach(row => {
      const raw = String(row[0] || '').trim();
      if (!raw) return;
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) arr.forEach(x => { if (x && x.q) out.push(String(x.q)); });
      } catch (e) {}
    });
    return out.slice(-15);
  } catch (e) {
    Logger.log(e);
    return [];
  }
}

function getStudioIntro_() {
  return [
    '음악실 동경하다는 수원 영통구와 안양 동안구에서 운영하는 실용음악학원입니다.',
    '드럼, 기타, 보컬, 피아노, 베이스, 작곡 수업을 운영하며',
    '초등학생부터 성인까지 개인의 목적과 속도에 맞춘 수업을 진행합니다.'
  ].join('\n');
}

function normalizeSections_(sections) {
  return {
    intro: String(sections.intro || '').trim(),
    body: String(sections.body || '').trim(),
    case: String(sections.case || '').trim()
  };
}

function normalizeFaq_(faq) {
  return (faq || []).map(item => ({
    q: String(item.q || item.question || '').trim(),
    a: String(item.a || item.answer || '').trim()
  })).filter(item => item.q && item.a);
}

function scrubSections_(sections, names) {
  return {
    intro: scrubKnownNames_(sections.intro, names),
    body: scrubKnownNames_(sections.body, names),
    case: scrubKnownNames_(sections.case, names)
  };
}

function scrubFaq_(faq, names) {
  return (faq || []).map(item => ({
    q: scrubKnownNames_(item.q, names),
    a: scrubKnownNames_(item.a, names)
  })).filter(item => item.q && item.a);
}

function scrubKnownNames_(text, names) {
  let t = String(text || '');
  (names || []).filter(Boolean).forEach(name => {
    const n = String(name || '').trim();
    if (!n) return;
    const escaped = n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    t = t.replace(new RegExp(escaped, 'g'), '한 수강생');
  });
  t = t.replace(/[가-힣]\s?\*/g, '한 수강생');
  t = t.replace(/[A-Z]\*/g, '한 수강생');
  t = t.replace(/[ㄱ-ㅎㅏ-ㅣ]{2,}/g, '한 수강생');
  return t.replace(/\s{2,}/g, ' ').trim();
}

function faqToText_(faq) {
  return (faq || []).map((item, i) => `Q${i + 1}. ${item.q}\nA. ${item.a}`).join('\n\n');
}

/* ========= 본문 길이 보정 ========= */
function resizeBodyWithGPT_(cfg, body, targetChars) {
  const key = getOpenAIKey_();
  const url = 'https://api.openai.com/v1/chat/completions';
  const target = Math.max(1500, Math.min(2200, targetChars | 0));

  const payload = {
    model: cfg.model,
    temperature: 0.4,
    max_tokens: cfg.max_tokens,
    messages: [
      { role: 'system', content: '너는 에디터다. 입력 본문을 같은 톤으로 유지하면서 길이만 조정한다. FAQ, 학원 소개, CTA 구조는 유지한다. 학생명/강사명은 절대 쓰지 않는다.' },
      { role: 'user', content: `요구 길이: ${target}자 내외 (±120자)\n금지어: 최고, 1등, 무조건, 보장, 100%\n학생 표현: 한 학생, 한 초등학생, 한 성인 수강생처럼 비식별 표현만 사용\n\n원문:\n${body}` }
    ]
  };

  const res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: `Bearer ${key}` },
    muteHttpExceptions: true,
    payload: JSON.stringify(payload)
  });

  if (res.getResponseCode() >= 200 && res.getResponseCode() < 300) {
    const json = JSON.parse(res.getContentText());
    return (json.choices?.[0]?.message?.content || '').trim() || body;
  }
  return body;
}

/* ========= 중복 검사 ========= */
function isDuplicateAcrossBranches_(newBody) {
  // 실제 결과가 쌓이는 targetSheetName 기준으로 중복을 검사한다.
  // 두 지점이 같은 sheetId를 쓰더라도 안양_v8/수원_v8 두 탭을 모두 확인한다.
  const targets = unique_([
    CONFIG.ANYANG.sheetId + '::' + CONFIG.ANYANG.targetSheetName,
    CONFIG.SUWON.sheetId + '::' + CONFIG.SUWON.targetSheetName
  ]);
  const newHash = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, newBody));

  for (const t of targets) {
    const [id, name] = t.split('::');
    try {
      const ss = SpreadsheetApp.openById(id);
      const sh = ss.getSheetByName(name);
      if (!sh || sh.getLastRow() < 2) continue;
      const headerMap = getHeaderMap_(sh);
      const bodyCol = headerMap['본문_MD'];
      if (!bodyCol) continue;
      const values = sh.getRange(2, bodyCol, sh.getLastRow() - 1, 1).getValues();
      for (let i = 0; i < values.length; i++) {
        const existing = String(values[i][0] || '');
        if (!existing) continue;
        const oldHash = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, existing));
        if (newHash === oldHash) return true;
        if (textSimilarity_(newBody, existing) > 0.7) return true;
      }
    } catch (e) {
      Logger.log(e);
    }
  }
  return false;
}

function textSimilarity_(a, b) {
  const ta = String(a || '').replace(/\s+/g, ' ').split(' ');
  const tb = String(b || '').replace(/\s+/g, ' ').split(' ');
  const sa = new Set(ta);
  const sb = new Set(tb);
  const inter = [...sa].filter(x => sb.has(x)).length;
  const union = new Set([...sa, ...sb]).size;
  return union ? inter / union : 0;
}

/* ========= 결과 시트 헤더 / 쓰기 ========= */
function HEADER_() {
  return [
    'post_id','상태','발행플랫폼','발행URL','예약시간','본문(복붙)','제목','해시태그',
    '섹션-도입','섹션-본문','섹션-사례','섹션-FAQ','FAQ_JSON','섹션-학원소개','섹션-CTA',
    '본문_MD','썸네일_아이디어','썸네일_제작정보','사진추천_조건','이미지_URLs',
    '업로드용_사진폴더','업로드용_사진목록',
    '학생명','수업일','파트/악기','타겟','클래스','강사명','원본행','에러로그',
    '사진캡션(CSV)'
  ];
}

function ensureTargetHeader_(dst) {
  const desired = HEADER_();
  if (dst.getLastRow() === 0) {
    dst.appendRow(desired);
    return;
  }

  const width = Math.max(dst.getLastColumn(), desired.length);
  const current = dst.getRange(1, 1, 1, width).getValues()[0].map(String);
  const have = new Set(current.filter(Boolean));
  const missing = desired.filter(h => !have.has(h));

  if (missing.length) {
    dst.insertColumnsAfter(dst.getLastColumn(), missing.length);
    dst.getRange(1, dst.getLastColumn() - missing.length + 1, 1, missing.length).setValues([missing]);
  }
}

function appendObjectRows_(sheet, rows) {
  if (!rows || !rows.length) return;
  ensureTargetHeader_(sheet);
  const header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  const values = rows.map(obj => header.map(h => Object.prototype.hasOwnProperty.call(obj, h) ? obj[h] : ''));
  sheet.getRange(sheet.getLastRow() + 1, 1, values.length, header.length).setValues(values);
}

function getHeaderMap_(sheet) {
  const lastCol = Math.max(1, sheet.getLastColumn());
  const header = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(String);
  const map = {};
  header.forEach((h, i) => { if (h) map[h] = i + 1; });
  return map;
}

function emptyObjectWithError_(part, start, end, tz, errorMsg) {
  return {
    'post_id': genPostId_(part, new Date(), tz),
    '상태': '에러',
    '제목': `${part} 생성 실패`,
    '수업일': `${Utilities.formatDate(start, tz, 'yyyy-MM-dd')}~${Utilities.formatDate(end, tz, 'yyyy-MM-dd')}`,
    '파트/악기': part,
    '에러로그': String(errorMsg || '')
  };
}

/* ========= 출석부 컬럼 ========= */
function buildColumnIndex_(header) {
  const find = (name, required) => {
    let i = header.indexOf(name);
    if (i === -1) {
      const trimmed = header.map(h => h.replace(/\s+/g, ''));
      i = trimmed.indexOf(name.replace(/\s+/g, ''));
    }
    if (required && i === -1) throw new Error(`'${name}' 컬럼 없음`);
    return i;
  };

  return {
    cData: find('데이터', false),
    cDate: find('날짜', true),
    cAttend: find('출결상황', true),
    cSong: find('수업곡', false),
    cNote: find('수업내용', false) >= 0 ? find('수업내용', false) : find('수업내용 ', false),
    cEval: find('레슨평가', false),
    cProgress: firstFoundColumn_(find, ['현재진행상태', '현재 진행 상태', '진행상태', '학생진행상태', '현재상태']),
    cPart: find('수업명', false) >= 0 ? find('수업명', false) : find('수업명 ', false),
    cTeacher: find('강사명', false),
    cStudent: find('이름', false) >= 0 ? find('이름', false) : find('수강자명', false)
  };
}

function collectLessonPackForPart_(cfg, rows, col, selectedPart, start, endPlus) {
  const pack = { text: [], songs: [], teachers: new Set(), students: new Set(), rowNums: [] };

  rows.forEach((r, ri) => {
    try {
      if (String(r[col.cAttend] ?? '').trim() !== '출석') return;

      const rawDate = r[col.cDate];
      const dt = rawDate instanceof Date ? rawDate : new Date(rawDate);
      if (isNaN(dt.getTime())) return;
      if (!(dt >= start && dt < endPlus)) return;

      const partRaw = col.cPart >= 0 ? String(r[col.cPart] ?? '') : (col.cData >= 0 ? String(r[col.cData] ?? '') : '');
      const part = normalizePart_(partRaw);
      if (part !== selectedPart) return;

      const note = col.cNote >= 0 ? String(r[col.cNote] ?? '').trim() : '';
      const evalTxt = col.cEval >= 0 ? String(r[col.cEval] ?? '').trim() : '';
      const song = col.cSong >= 0 ? String(r[col.cSong] ?? '').trim() : '';
      const progress = col.cProgress >= 0 ? String(r[col.cProgress] ?? '').trim() : '';
      if (!song && !note && !evalTxt && !progress) return;

      const teacher = col.cTeacher >= 0 ? String(r[col.cTeacher] ?? '').trim() : '';
      const student = col.cStudent >= 0 ? String(r[col.cStudent] ?? '').trim() : '';
      const merged = buildLessonSeedText_({ song, note, evalTxt, progress }, { studentName: student, teacherName: teacher });
      if (!merged) return;

      pack.text.push(merged);
      if (song) pack.songs.push(song);
      if (teacher) pack.teachers.add(teacher);
      if (student) pack.students.add(student);
      pack.rowNums.push(cfg.headerRow + 1 + ri);
    } catch (e) {
      Logger.log(e);
    }
  });

  return pack;
}

function firstFoundColumn_(findFn, names) {
  for (let i = 0; i < names.length; i++) {
    const idx = findFn(names[i], false);
    if (idx >= 0) return idx;
  }
  return -1;
}

/* ========= 기간 자동 추론 ========= */
function inferPeriodAuto_(rows, cols, tz) {
  const eligible = [];
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const attendOk = String(r[cols.cAttend] ?? '').trim() === '출석';
    const song = cols.cSong >= 0 ? String(r[cols.cSong] ?? '').trim() : '';
    const note = cols.cNote >= 0 ? String(r[cols.cNote] ?? '').trim() : '';
    const evalT = cols.cEval >= 0 ? String(r[cols.cEval] ?? '').trim() : '';
    const progress = cols.cProgress >= 0 ? String(r[cols.cProgress] ?? '').trim() : '';
    if (!attendOk || !(song || note || evalT || progress)) continue;

    const rawDate = r[cols.cDate];
    const dt = rawDate instanceof Date ? rawDate : new Date(rawDate);
    if (!isNaN(dt.getTime())) eligible.push(dt);
  }

  if (!eligible.length) {
    const end = normalizeDate_(new Date());
    const start = normalizeDate_(addDays_(end, -27));
    return { start, end };
  }

  eligible.sort((a, b) => a - b);
  if (eligible.length >= 50) {
    const startIdx = Math.floor(Math.random() * (eligible.length - 50 + 1));
    const seg = eligible.slice(startIdx, startIdx + 50);
    return { start: normalizeDate_(seg[0]), end: normalizeDate_(seg[seg.length - 1]) };
  }

  const end = normalizeDate_(eligible[eligible.length - 1]);
  const start = normalizeDate_(addDays_(end, -27));
  return { start, end };
}

/* ========= 로테이션 / 정규화 ========= */
function getCfg_(branchKey) {
  const cfg = CONFIG[branchKey];
  if (!cfg) throw new Error(`CONFIG.${branchKey}가 없습니다.`);
  return cfg;
}

function openSourceSpreadsheet_(cfg) {
  if (cfg.sourceSpreadsheetId) return SpreadsheetApp.openById(cfg.sourceSpreadsheetId);
  const active = SpreadsheetApp.getActive();
  if (!active) throw new Error(`${cfg.branchKey}.sourceSpreadsheetId를 입력해야 standalone 트리거에서 출석부를 읽을 수 있습니다.`);
  return active;
}

function getNextPartRotation_(cfg) {
  const i = getAndBumpCounter_(`PART_ROT_IDX_${cfg.branchKey}`, cfg.partRotation.length);
  return cfg.partRotation[i];
}

function pickLocalLabel_(cfg) {
  const pool = cfg.localLabels || [cfg.city + ' '];
  const idx = getAndBumpCounter_(`CITY_ROT_IDX_${cfg.branchKey}`, pool.length);
  return pool[idx];
}

function pickTarget_() {
  const arr = ['초등', '중고등', '성인', '직장인', '초보자'];
  return arr[Math.floor(Math.random() * arr.length)];
}

function normalizePart_(txt) {
  const t = String(txt || '');
  if (/베이스/i.test(t)) return '베이스기타';
  if (/(일렉\s*기타|일렉기타|통\s*기타|통기타|Electric\s*Guitar|Acoustic\s*Guitar|기타)/i.test(t)) return '기타';
  if (/성인\s*피아노|피아노/i.test(t)) return '피아노';
  if (/드럼/i.test(t)) return '드럼';
  if (/보컬|발성|노래/i.test(t)) return '보컬';
  if (/작곡/i.test(t)) return '작곡';
  if (/미디|MIDI|DAW/i.test(t)) return '미디';
  if (/공통/.test(t)) return '공통';
  return '음악';
}

function buildTargetGuide_(target) {
  const map = {
    '초등': '초등학생 또는 학부모가 공감할 수 있는 시작 시기, 흥미, 성장 포인트를 반영하라.',
    '중고등': '중고등학생이 공감할 수 있는 실력 변화, 집중, 수행평가/입시/취미 확장 가능성을 반영하라.',
    '성인': '성인이 공감할 수 있는 취미 시작, 자기만의 시간, 성취감의 흐름을 반영하라.',
    '직장인': '직장인이 공감할 수 있는 퇴근 후 취미, 불규칙한 스케줄, 꾸준히 다니기 좋은 구조를 반영하라.',
    '초보자': '완전 초보자가 공감할 수 있는 처음 시작의 부담, 기초, 천천히 배우는 과정, 작은 변화의 즐거움을 반영하라.'
  };
  return map[target] || map['초보자'];
}

function getAndBumpCounter_(key, modulo) {
  const sp = PropertiesService.getScriptProperties();
  let n = Number(sp.getProperty(key) || '0');
  const out = n % modulo;
  sp.setProperty(key, String((n + 1) % 1000000));
  return out;
}

function cleanupTitle_(title, local, part) {
  let t = String(title || '').trim();
  const localClean = String(local || '').trim();
  const partClean = String(part || '').trim();
  const wordsToRemove = [
    `${localClean}${partClean}학원`,
    `${localClean} ${partClean}학원`,
    `${partClean}학원`,
    `${partClean}레슨`,
    localClean,
    '학원',
    '레슨'
  ].filter(Boolean);

  wordsToRemove.forEach(word => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    t = t.replace(new RegExp(escaped, 'gi'), ' ');
  });

  t = t.replace(/\s{2,}/g, ' ').replace(/^[:\-–—,.\s]+/, '').trim();
  if (!t) t = `${partClean} 초보도 시작할 수 있는 수업 후기`;
  return t;
}

function sanitizeLessonText_(text, opts) {
  let t = String(text || '').trim();
  const studentName = String((opts && opts.studentName) || '').trim();
  const teacherName = String((opts && opts.teacherName) || '').trim();

  if (studentName) {
    const escapedStudent = studentName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    t = t.replace(new RegExp(escapedStudent, 'g'), '학생');
  }
  if (teacherName) {
    const escapedTeacher = teacherName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    t = t.replace(new RegExp(escapedTeacher, 'g'), '강사');
  }

  t = t.replace(/[가-힣]{2,4}(학생|님)/g, '학생');
  t = t.replace(/[가-힣]{2,4}(선생님|쌤)/g, '강사');
  t = t.replace(/[가-힣]\s?\*/g, '학생');
  t = t.replace(/[A-Z]\*/g, '학생');
  t = t.replace(/[ㄱ-ㅎㅏ-ㅣ]{2,}/g, '학생');
  t = t.replace(/\s{2,}/g, ' ').trim();
  return t;
}

function buildLessonSeedText_(lesson, opts) {
  const parts = [];
  if (lesson.song) parts.push(`수업곡: ${lesson.song}`);
  if (lesson.note) parts.push(`수업내용: ${lesson.note}`);
  if (lesson.evalTxt) parts.push(`레슨평가: ${lesson.evalTxt}`);
  if (lesson.progress) parts.push(`현재진행상태: ${lesson.progress}`);
  return sanitizeLessonText_(parts.join(' / '), opts);
}

/* ========= 해시태그 / CTA ========= */
function buildSeoHashtags_({ cfg, city, part, song, period, localLabel }) {
  const local = String(localLabel || '').trim();
  const base = [
    '#음악실동경하다',
    '#실용음악학원',
    `#${city}실용음악학원`,
    `#${city}${part}학원`
  ];
  const partTags = [`#${city}${part}학원`, `#${part}학원`];
  const localTags = local ? [
    `#${local}실용음악학원`.replace(/\s+/g, ''),
    `#${local}${part}학원`.replace(/\s+/g, '')
  ] : [];
  const songTag = song ? [`#${String(song).replace(/\s+/g, '')}`] : [];
  const all = [...base, ...(cfg.cityHashtags || []), ...partTags, ...localTags, ...songTag];
  return unique_(all.filter(Boolean)).slice(0, 10);
}

function trialCTA_(cfg, part) {
  const p = normalizePart_(part);
  const bookingUrl = cfg.trialCTA.booking[p] || '';
  const label = `${p === '음악' ? '음악' : p} 체험 수업`;

  return [
    '체험 수업 예약',
    bookingUrl ? `${label}: ${bookingUrl}` : `체험수업 문의: ${cfg.trialCTA.kakaoUrl}`,
    `네이버 플레이스: ${cfg.trialCTA.mapUrl}`,
    `카카오 문의: ${cfg.trialCTA.kakaoUrl}`
  ].join('\n');
}

/* ========= 네이버 블로그 복붙 문자열 ========= */
function assembleFinal_({ title, part, city, localLabel, thumbnailInfo, photoGuide, uploadFolder, sections, faq, studioIntro, cta, photoCaptions, hashtagsLine }) {
  const photoLines = buildPhotoPlaceholders_(photoCaptions);
  const lessonFlow = getLessonFlow_(part);
  const philosophy = getPhilosophy_();
  const areaLine = buildAreaCtaLine_(city, localLabel, part);

  return [
    `# ${title}`,
    '',
    '## 썸네일 제작 정보',
    '',
    thumbnailInfoToText_(thumbnailInfo),
    '',
    '## 본문 사진 추천 조건',
    '',
    photoGuideToText_(photoGuide),
    '',
    uploadFolderToText_(uploadFolder),
    '',
    '---',
    '',
    photoLines[0],
    '',
    sections.intro,
    '',
    '---',
    '',
    '## 처음 시작할 때 가장 많이 막히는 부분',
    '',
    sections.body,
    '',
    photoLines[1],
    '',
    '## 자주 묻는 질문',
    '',
    faqToNaverText_(faq),
    '',
    '---',
    '',
    '## 수업은 이렇게 진행됩니다',
    '',
    lessonFlow,
    '',
    photoLines[2],
    '',
    '## 실제 수업 한 장면',
    '',
    sections.case,
    '',
    '## 동경하다가 수업을 바라보는 방식',
    '',
    philosophy,
    '',
    studioIntro,
    '',
    photoLines[3],
    '',
    '## 상담 안내',
    '',
    '음악을 처음 시작하는 분들도 괜찮습니다.',
    '',
    '지금의 속도에 맞춰 천천히 시작할 수 있도록',
    '음악실 동경하다에서 함께 안내해드리겠습니다.',
    '',
    areaLine,
    '',
    cta,
    '',
    hashtagsLine
  ].filter(Boolean).join('\n');
}

function buildPhotoPlaceholders_(photoCaptions) {
  const caps = (photoCaptions || []).map(c => String(c || '').trim()).filter(Boolean);
  const defaults = [
    '대표 이미지 / 수업실 또는 악기 전체 컷',
    '손, 악기, 악보 등 클로즈업',
    '수업 장면 또는 연습 장면',
    '연습실, 공간, 악기 세팅'
  ];
  return defaults.map((fallback, i) => `[사진 ${i + 1}: ${caps[i] || fallback}]`);
}

function normalizeThumbnailInfo_(info, fallback) {
  const raw = info && typeof info === 'object' ? info : {};
  const p = normalizePart_(fallback.part);
  const titleMain = String(raw.title_main || '').trim() || makeThumbnailMainText_(fallback.title, p);
  const titleSub = String(raw.title_sub || '').trim() || `${fallback.city} ${p}학원에서 자주 듣는 질문`;
  return {
    template_type: String(raw.template_type || '').trim() || pickThumbnailTemplateType_(fallback.target),
    background_photo: String(raw.background_photo || '').trim() || `${p} 손 클로즈업 / 얼굴 비노출`,
    title_main: titleMain,
    title_sub: titleSub,
    brand_name: String(raw.brand_name || '').trim() || '음악실 동경하다',
    tone: String(raw.tone || '').trim() || '따뜻함, 차분함, 초보자 친화'
  };
}

function thumbnailInfoToText_(info) {
  if (!info) return '';
  return [
    `- Canva 템플릿 유형: ${info.template_type}`,
    `- 추천 배경 사진: ${info.background_photo}`,
    `- 메인 문구: ${info.title_main}`,
    `- 서브 문구: ${info.title_sub}`,
    `- 브랜드명: ${info.brand_name}`,
    `- 권장 톤: ${info.tone}`
  ].join('\n');
}

/* ========= 사진태깅 연동 (v9.0 핵심) ========= */
function selectTaggedPhotosForPost_(ss, cfg, part, count) {
  const sheet = ss.getSheetByName('사진태깅');
  if (!sheet || sheet.getLastRow() < 2) {
    Logger.log('사진태깅 탭 없음/빈 시트 → Drive 폴백');
    return selectDriveImages_(cfg, part, count);
  }

  const headerMap = getHeaderMap_(sheet);
  const required = ['지점', '파트', '사진유형', '파일ID', '파일명'];
  const missing = required.filter(name => !headerMap[name]);
  if (missing.length) {
    Logger.log('사진태깅 필수 컬럼 없음: ' + missing.join(', ') + ' → Drive 폴백');
    return selectDriveImages_(cfg, part, count);
  }

  ensurePhotoUsageColumnsForBlog_(sheet);

  const map = getHeaderMap_(sheet);
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  const p = normalizePart_(part);
  const limit = count || 10;
  const selected = [];
  const usedIds = {};

  const allCandidates = values.map((row, i) => buildTaggedPhotoObject_(row, map, i + 2))
    .filter(img => img && img.id)
    .filter(img => normalizeBranch_(img.branch) === normalizeBranch_(cfg.city))
    .filter(img => img.part === p || img.part === '공통')
    .filter(img => !isRejectedPhoto_(img))
    .sort(compareTaggedPhotoUsage_);

  Logger.log(`사진태깅 후보 수: ${cfg.city} / ${p} = ${allCandidates.length}`);

  // 후보가 0개면 태깅 시트를 못 읽은 것과 다름없으니 Drive 폴백
  if (!allCandidates.length) {
    Logger.log('사진태깅 후보 0개 → Drive 폴백. 지점/파트 값 확인 필요.');
    return selectDriveImages_(cfg, part, limit);
  }

  const plan = buildPhotoPickPlanForPart_(p);

  plan.forEach(slot => {
    if (selected.length >= limit) return;
    const img = pickDiverseTaggedPhoto_(allCandidates, {
      photoTypes: slot.photoTypes,
      parts: slot.parts,
      usedIds: usedIds
    });
    if (!img) return;
    img.slotLabel = slot.label;
    selected.push(img);
    usedIds[img.id] = true;
  });

  // 슬롯으로 다 못 채우면 남은 후보로 채움
  if (selected.length < limit) {
    allCandidates
      .filter(img => !usedIds[img.id])
      .sort(compareTaggedPhotoUsage_)
      .forEach(img => {
        if (selected.length >= limit) return;
        img.slotLabel = img.postPosition || img.rawPhotoType || img.photoType || '예비 사진';
        selected.push(img);
        usedIds[img.id] = true;
      });
  }

  Logger.log(`사진태깅 선택 수: ${cfg.city} / ${p} = ${selected.length}`);
  return selected.length ? selected : selectDriveImages_(cfg, part, limit);
}

function buildPhotoPickPlanForPart_(part) {
  const p = normalizePart_(part);

  const commonSlots = [
    { label: '공간/연습실', photoTypes: ['공간사진', '복도_공간', '연습실'], parts: [p, '공통'] },
    { label: '로비/입구', photoTypes: ['로비_상담', '외관_입구'], parts: ['공통', p] },
    { label: '합주/공연', photoTypes: ['합주실', '합주&공연'], parts: ['공통', p] },
    { label: '브랜드/안내', photoTypes: ['브랜드_분위기', '안내문_게시물'], parts: ['공통', p] }
  ];

  if (p === '보컬') {
    return [
      { label: '대표 이미지', photoTypes: ['대표이미지'], parts: [p, '공통'] },
      { label: '보컬 수업 장면', photoTypes: ['수업장면'], parts: [p] },
      { label: '발성/마이크', photoTypes: ['발성_마이크', '클로즈업'], parts: [p, '공통'] },
      { label: '보컬 공간', photoTypes: ['공간사진', '연습실'], parts: [p, '공통'] },
      ...commonSlots,
      { label: '예비 보컬 사진', photoTypes: ['기타'], parts: [p, '공통'] }
    ];
  }

  if (p === '피아노') {
    return [
      { label: '대표 이미지', photoTypes: ['대표이미지'], parts: [p, '공통'] },
      { label: '피아노 클로즈업', photoTypes: ['클로즈업'], parts: [p] },
      { label: '피아노 수업 장면', photoTypes: ['수업장면'], parts: [p] },
      { label: '피아노 공간', photoTypes: ['공간사진', '연습실'], parts: [p, '공통'] },
      ...commonSlots,
      { label: '예비 피아노 사진', photoTypes: ['기타'], parts: [p, '공통'] }
    ];
  }

  if (p === '작곡' || p === '미디') {
    return [
      { label: `${p} 대표 이미지`, photoTypes: ['대표이미지'], parts: [p, '공통'] },
      { label: `${p} 수업 장면`, photoTypes: ['수업장면'], parts: [p] },
      { label: '교재/커리큘럼', photoTypes: ['교재_커리큘럼', '안내문_게시물'], parts: [p, '공통'] },
      { label: `${p} 공간`, photoTypes: ['공간사진', '연습실'], parts: [p, '공통'] },
      ...commonSlots,
      { label: `${p} 예비 사진`, photoTypes: ['기타'], parts: [p, '공통'] }
    ];
  }

  // 드럼 / 기타 / 베이스기타 / 기본
  return [
    { label: `${p} 대표 이미지`, photoTypes: ['대표이미지'], parts: [p, '공통'] },
    { label: `${p} 클로즈업`, photoTypes: ['클로즈업'], parts: [p] },
    { label: `${p} 수업 장면`, photoTypes: ['수업장면'], parts: [p] },
    { label: `${p} 공간`, photoTypes: ['공간사진', '연습실'], parts: [p, '공통'] },
    { label: '교재/커리큘럼', photoTypes: ['교재_커리큘럼', '안내문_게시물'], parts: [p, '공통'] },
    ...commonSlots,
    { label: `${p} 예비 사진`, photoTypes: ['기타'], parts: [p, '공통'] }
  ];
}

function pickDiverseTaggedPhoto_(candidates, opts) {
  const partSet = {};
  (opts.parts || []).forEach(part => { if (part) partSet[normalizePart_(part)] = true; });

  const typeSet = {};
  (opts.photoTypes || []).forEach(type => { if (type) typeSet[normalizePhotoType_(type)] = true; });

  const filtered = candidates
    .filter(img => !opts.usedIds[img.id])
    .filter(img => partSet[img.part])
    .filter(img => typeSet[img.photoType])
    .sort(compareTaggedPhotoUsage_);

  return filtered[0] || null;
}

function buildTaggedPhotoObject_(row, map, rowNumber) {
  const get = name => map[name] ? String(row[map[name] - 1] || '').trim() : '';
  const id = get('파일ID');
  if (!id) return null;

  const fileName = get('파일명') || '사진';

  return {
    id: id,
    title: fileName,
    url: `https://drive.google.com/file/d/${id}/view`,
    branch: get('지점'),
    part: normalizePart_(get('파트')),
    rawPhotoType: get('사진유형'),
    photoType: normalizePhotoType_(get('사진유형')),
    core: get('핵심내용'),
    exposure: get('노출상태'),
    imageType: get('이미지유형'),
    seoKeyword: get('추천SEO키워드'),
    postPosition: get('추천_글내위치'),
    reviewNeeded: get('검수필요'),
    memo: get('비고'),
    photoContext: extractPhotoContextFromFileName_(fileName),
    rowNumber: rowNumber,
    recommendedCount: map['추천횟수'] ? Number(row[map['추천횟수'] - 1] || 0) : 0,
    lastRecommendedAt: map['마지막추천일'] ? row[map['마지막추천일'] - 1] : ''
  };
}

function normalizePhotoType_(type) {
  const t = String(type || '').trim();
  if (t === '공간') return '공간사진';
  return t;
}

function normalizeBranch_(value) {
  return String(value || '')
    .replace(/점$/g, '')
    .replace(/\s+/g, '')
    .trim();
}

function isRejectedPhoto_(img) {
  const hay = [
    img.rawPhotoType, img.core, img.exposure, img.imageType, img.reviewNeeded, img.memo
  ].join(' ');
  return /휴지통|삭제|사용금지/i.test(hay);
}

function extractPhotoContextFromFileName_(fileName) {
  return String(fileName || '')
    .replace(/\.[^.]+$/, '')
    .replace(/IMG[_-]?\d+/gi, '')
    .replace(/KakaoTalk_\d+_\d+/gi, '')
    .replace(/^\d+[_\-\s]*/, '')
    .replace(/[_\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatPhotoTagsForPrompt_(images) {
  const arr = images || [];
  if (!arr.length) return '- 없음';

  return arr.map((img, i) => {
    return [
      `사진 ${i + 1}`,
      img.slotLabel ? `추천슬롯: ${img.slotLabel}` : '',
      `사진유형: ${img.rawPhotoType || img.photoType || '미지정'}`,
      img.core ? `핵심내용: ${img.core}` : '',
      img.exposure ? `노출상태: ${img.exposure}` : '',
      img.imageType ? `이미지유형: ${img.imageType}` : '',
      img.seoKeyword ? `추천SEO키워드: ${img.seoKeyword}` : '',
      img.postPosition ? `추천_글내위치: ${img.postPosition}` : '',
      img.reviewNeeded ? `검수필요: ${img.reviewNeeded}` : '',
      `파일명해석: ${img.photoContext || img.title || ''}`,
      `원본파일명: ${img.title || ''}`,
      `지점: ${img.branch || ''}`,
      `파트: ${img.part || ''}`,
      img.memo ? `비고: ${img.memo}` : '',
      `추천횟수: ${img.recommendedCount || 0}`
    ].filter(Boolean).join(' / ');
  }).join('\n');
}

function compareTaggedPhotoUsage_(a, b) {
  if (a.recommendedCount !== b.recommendedCount) {
    return a.recommendedCount - b.recommendedCount;
  }
  const ad = a.lastRecommendedAt instanceof Date ? a.lastRecommendedAt.getTime() : 0;
  const bd = b.lastRecommendedAt instanceof Date ? b.lastRecommendedAt.getTime() : 0;
  return ad - bd;
}

function markTaggedPhotosUsed_(ss, images, postTitle, tz) {
  if (!images || !images.length) return;

  const sheet = ss.getSheetByName('사진태깅');
  if (!sheet) return;

  ensurePhotoUsageColumnsForBlog_(sheet);
  const map = getHeaderMap_(sheet);
  const now = new Date();

  images.forEach(img => {
    if (!img.rowNumber || !map['추천횟수']) return;

    const countCell = sheet.getRange(img.rowNumber, map['추천횟수']);
    const current = Number(countCell.getValue() || 0);
    countCell.setValue(isNaN(current) ? 1 : current + 1);

    if (map['마지막추천일']) {
      sheet.getRange(img.rowNumber, map['마지막추천일'])
        .setValue(now)
        .setNumberFormat('yyyy-mm-dd hh:mm');
    }
    if (map['마지막추천글']) {
      sheet.getRange(img.rowNumber, map['마지막추천글']).setValue(postTitle || '');
    }
    if (map['노출상태']) {
      const exposureCell = sheet.getRange(img.rowNumber, map['노출상태']);
      const currentExposure = String(exposureCell.getValue() || '').trim();
      if (currentExposure !== '사용됨') exposureCell.setValue('추천됨');
    }
  });
}

function ensurePhotoUsageColumnsForBlog_(sheet) {
  const needed = ['추천횟수', '마지막추천일', '마지막추천글', '노출상태'];
  const header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  needed.forEach(name => {
    if (header.indexOf(name) === -1) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(name);
      header.push(name);
    }
  });
}

/* ========= 사진 추천 가이드 (사진태깅 값 반영) ========= */
function buildPhotoRecommendationGuide_(cfg, part, selectedImages) {
  const images = selectedImages || [];

  if (!images.length) {
    return [{
      slot: '사진 추천',
      recommendation: `${cfg.city} / ${normalizePart_(part)} 사진 후보가 없습니다. 사진태깅 탭을 확인해 주세요.`
    }];
  }

  return images.map((img, i) => {
    return {
      slot: `사진 ${i + 1}: ${img.slotLabel || img.rawPhotoType || img.photoType || '추천 사진'}`,
      recommendation: [
        `사진유형: ${img.rawPhotoType || img.photoType || '미지정'}`,
        img.core ? `핵심내용: ${img.core}` : '',
        img.exposure ? `노출상태: ${img.exposure}` : '',
        img.imageType ? `이미지유형: ${img.imageType}` : '',
        img.seoKeyword ? `추천SEO키워드: ${img.seoKeyword}` : '',
        img.postPosition ? `추천_글내위치: ${img.postPosition}` : '',
        img.reviewNeeded ? `검수필요: ${img.reviewNeeded}` : '',
        `파일명해석: ${img.photoContext || img.title}`,
        img.memo ? `비고: ${img.memo}` : '',
        `지점/파트: ${img.branch || cfg.city} / ${img.part || normalizePart_(part)}`,
        `원본파일명: ${img.title}`,
        img.url
      ].filter(Boolean).join('\n')
    };
  });
}

function photoGuideToText_(guide) {
  return (guide || []).map(item => [
    `[${item.slot}]`,
    `추천: ${item.recommendation}`
  ].join('\n')).join('\n\n');
}

/* ========= Drive 폴백 + 업로드 폴더 ========= */
function selectDriveImages_(cfg, part, count) {
  try {
    if (!cfg.imageRootFolderId) return [];
    const root = DriveApp.getFolderById(cfg.imageRootFolderId);
    const folders = root.getFolders();
    const targetNames = [cfg.city, cfg.branchKey, normalizePart_(part), part].map(String);
    const candidates = [];
    collectImagesRecursive_(root, candidates, targetNames, 0, 3);
    candidates.sort((a, b) => b.updated - a.updated);
    return candidates.slice(0, count || 4);
  } catch (e) {
    Logger.log('이미지 폴백 실패: ' + e);
    return [];
  }
}

function collectImagesRecursive_(folder, out, targetNames, depth, maxDepth) {
  if (depth > maxDepth) return;
  const files = folder.getFiles();
  while (files.hasNext()) {
    const f = files.next();
    const name = f.getName();
    const mime = f.getMimeType();
    if (!/^image\//i.test(mime)) continue;
    const pathHit = targetNames.some(t => t && name.indexOf(t) >= 0);
    out.push({
      id: f.getId(),
      title: name,
      url: f.getUrl(),
      branch: '',
      part: '',
      rawPhotoType: '',
      photoType: '',
      core: '',
      exposure: '',
      imageType: '',
      seoKeyword: '',
      postPosition: '',
      reviewNeeded: '',
      memo: '',
      photoContext: extractPhotoContextFromFileName_(name),
      updated: f.getLastUpdated().getTime(),
      rowNumber: null,
      recommendedCount: 0,
      lastRecommendedAt: ''
    });
  }
  const sub = folder.getFolders();
  while (sub.hasNext()) {
    collectImagesRecursive_(sub.next(), out, targetNames, depth + 1, maxDepth);
  }
}

function createUploadImageFolder_(cfg, part, images, meta) {
  const result = { url: '', fileNames: [] };
  try {
    if (!cfg.imageRootFolderId || !images || !images.length) return result;
    const root = DriveApp.getFolderById(cfg.imageRootFolderId);
    const dateLabel = Utilities.formatDate(meta.date || new Date(), meta.timezone || cfg.timezone, 'yyyyMMdd');
    const safeTitle = String(meta.title || '').replace(/[\\/:*?"<>|]/g, '').slice(0, 35);
    const folderName = `블로그업로드_${cfg.city}_${normalizePart_(part)}_${dateLabel}_${safeTitle}`;
    const folder = root.createFolder(folderName);
    images.forEach((img, i) => {
      try {
        const file = DriveApp.getFileById(img.id);
        const ext = guessExtensionFromName_(file.getName());
        const newName = `${String(i + 1).padStart(2, '0')}_${normalizePart_(part)}_${img.slotLabel || img.rawPhotoType || '사진'}${ext}`.replace(/[\\/:*?"<>|]/g, '_');
        file.makeCopy(newName, folder);
        result.fileNames.push(newName);
      } catch (e) {
        Logger.log('사진 복사 실패: ' + e);
      }
    });
    result.url = folder.getUrl();
  } catch (e) {
    Logger.log('업로드용 폴더 생성 실패: ' + e);
  }
  return result;
}

function guessExtensionFromName_(name) {
  const m = String(name || '').match(/\.[a-zA-Z0-9]{2,5}$/);
  return m ? m[0] : '.jpg';
}

function uploadFolderToText_(folder) {
  if (!folder || !folder.url) return '- 업로드용 사진 폴더: 생성 안 됨';
  return [
    `- 업로드용 사진 폴더: ${folder.url}`,
    '- 업로드용 사진 목록:',
    ...(folder.fileNames || []).map(n => `  - ${n}`)
  ].join('\n');
}

/* ========= Docs Export ========= */
function menuExportSelectedToDocs() {
  const sh = SpreadsheetApp.getActiveSheet();
  const row = sh.getActiveRange().getRow();
  if (row <= 1) {
    SpreadsheetApp.getUi().alert('내보낼 데이터 행을 선택해 주세요.');
    return;
  }
  exportRowToGoogleDocs_(sh, row);
}

function exportRowToGoogleDocs_(sheet, row) {
  const map = getHeaderMap_(sheet);
  const get = name => map[name] ? String(sheet.getRange(row, map[name]).getValue() || '') : '';
  const title = get('제목') || '블로그 글';
  const body = get('본문(복붙)') || get('본문_MD');
  if (!body) {
    SpreadsheetApp.getUi().alert('본문이 없습니다.');
    return;
  }

  const doc = DocumentApp.create(title.slice(0, 120));
  const docBody = doc.getBody();
  docBody.clear();
  renderMarkdownLikeTextToDoc_(docBody, body);
  doc.saveAndClose();

  const url = doc.getUrl();
  if (map['발행URL']) sheet.getRange(row, map['발행URL']).setValue(url);
  SpreadsheetApp.getUi().alert(`Google Docs 생성 완료\n${url}`);
}

function renderMarkdownLikeTextToDoc_(docBody, text) {
  const lines = String(text || '').split('\n');
  lines.forEach(line => {
    if (/^#\s+/.test(line)) {
      const p = docBody.appendParagraph(line.replace(/^#\s+/, ''));
      p.setHeading(DocumentApp.ParagraphHeading.HEADING1);
      styleParagraph_(p, DOC_STYLE.sizeH1, true);
    } else if (/^##\s+/.test(line)) {
      const p = docBody.appendParagraph(line.replace(/^##\s+/, ''));
      p.setHeading(DocumentApp.ParagraphHeading.HEADING2);
      styleParagraph_(p, DOC_STYLE.sizeH2, true);
    } else if (/^---+$/.test(line.trim())) {
      docBody.appendHorizontalRule();
    } else {
      const p = docBody.appendParagraph(line);
      styleParagraph_(p, DOC_STYLE.sizeBody, false);
    }
  });
}

function styleParagraph_(p, size, bold) {
  try {
    p.setFontFamily(DOC_STYLE.fontBody).setFontSize(size).setForegroundColor(DOC_STYLE.colorBody);
    if (bold) p.setBold(true).setForegroundColor(DOC_STYLE.colorHeading);
  } catch (e) {}
}

/* ========= 최종 복붙 보조 텍스트 ========= */
function faqToNaverText_(faq) {
  return (faq || []).map((item, i) => [
    `Q. ${item.q}`,
    '',
    `A. ${item.a}`
  ].join('\n')).join('\n\n');
}

function getLessonFlow_(part) {
  const p = normalizePart_(part);
  const map = {
    '드럼': [
      '드럼 수업은 기본 리듬을 몸에 익히는 것부터 시작합니다.',
      '처음에는 손과 발을 따로 확인하고, 이후에는 느린 템포에서 함께 연결합니다.',
      '곡을 연주할 때도 바로 빠르게 치기보다 리듬, 필인, 곡의 흐름을 나누어 연습합니다.'
    ],
    '기타': [
      '기타 수업은 자세, 코드 전환, 리듬 스트로크를 차근차근 확인합니다.',
      '처음부터 많은 코드를 외우기보다 실제 곡에서 자주 쓰는 움직임을 반복합니다.',
      '손가락 힘과 리듬감을 함께 잡아가며 자연스럽게 곡 연주로 연결합니다.'
    ],
    '베이스기타': [
      '베이스 수업은 리듬과 루트 움직임을 중심으로 시작합니다.',
      '드럼과 함께 맞물리는 감각을 익히며 곡의 중심을 잡는 연습을 합니다.',
      '단순한 음을 정확한 타이밍에 연주하는 것부터 차근차근 쌓아갑니다.'
    ],
    '피아노': [
      '피아노 수업은 손 모양, 리듬, 코드 읽기를 함께 확인합니다.',
      '악보를 읽는 부담을 줄이고, 짧은 구간을 반복하며 곡 전체로 확장합니다.',
      '초보자도 자신의 속도에 맞춰 음악의 흐름을 이해하도록 안내합니다.'
    ],
    '보컬': [
      '보컬 수업은 호흡, 발음, 음정, 소리의 방향을 함께 확인합니다.',
      '곡을 부르기 전에 몸과 목의 긴장을 줄이고, 필요한 발성 요소를 나누어 연습합니다.',
      '노래 전체를 무리하게 밀어붙이기보다 한 소절씩 안정감을 만들어 갑니다.'
    ],
    '작곡': [
      '작곡 수업은 멜로디, 코드, 리듬 아이디어를 작은 단위로 정리하는 것부터 시작합니다.',
      '떠오른 아이디어를 기록하고, 곡의 구조 안에서 어떻게 발전시킬지 함께 확인합니다.',
      '완성보다 먼저 자기만의 음악 언어를 찾는 과정을 중요하게 봅니다.'
    ],
    '미디': [
      '미디 수업은 DAW의 기본 조작과 소리 선택부터 차근차근 시작합니다.',
      '리듬, 코드, 멜로디를 직접 찍어보며 음악이 만들어지는 구조를 이해합니다.',
      '장비보다 중요한 것은 아이디어를 정리하고 소리로 구현하는 과정입니다.'
    ]
  };
  return (map[p] || [
    '수업은 현재 수준을 확인하고, 필요한 기초를 나누어 익히는 방식으로 진행합니다.',
    '한 번에 많은 것을 하기보다 직접 해보고 다시 확인하는 과정을 중요하게 봅니다.',
    '각자의 속도에 맞춰 음악을 오래 즐길 수 있도록 안내합니다.'
  ]).join('\n');
}

function getPhilosophy_() {
  return [
    '동경하다는 결과만 빠르게 만드는 수업보다, 학생이 스스로 이해하고 다시 해낼 수 있는 과정을 중요하게 생각합니다.',
    '처음에는 느리고 서툴러도 괜찮습니다.',
    '작은 성공 경험이 쌓이면 연습을 대하는 태도와 자신감도 함께 달라집니다.'
  ].join('\n');
}

function buildAreaCtaLine_(city, localLabel, part) {
  const local = String(localLabel || '').trim();
  const p = normalizePart_(part);
  if (local) return `${local} ${p}학원 또는 ${city} 실용음악학원을 찾고 계신다면, 현재 수준과 목적에 맞는 수업 방향을 함께 상담해드릴 수 있습니다.`;
  return `${city} ${p}학원 또는 실용음악학원을 찾고 계신다면, 현재 수준과 목적에 맞는 수업 방향을 함께 상담해드릴 수 있습니다.`;
}

function makeThumbnailMainText_(title, part) {
  const t = String(title || '').replace(/^.*?,\s*/, '').replace(/[?？]$/, '').trim();
  return t.slice(0, 22) || `${normalizePart_(part)} 수업 이야기`;
}

function pickThumbnailTemplateType_(target) {
  if (target === '초등') return '학부모 Q&A형';
  if (target === '직장인' || target === '성인') return '성인 취미 공감형';
  return 'Q&A형';
}

/* ========= 유틸 ========= */
function parseDate_(s, tz, errMsg) {
  const m = String(s || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) throw new Error(errMsg || '날짜 형식 오류');
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

function normalizeDate_(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays_(d, days) {
  const x = new Date(d.getTime());
  x.setDate(x.getDate() + days);
  return x;
}

function genPostId_(part, date, tz) {
  return [
    'BLOG',
    Utilities.formatDate(date || new Date(), tz || 'Asia/Seoul', 'yyyyMMddHHmmss'),
    normalizePart_(part)
  ].join('_');
}

function unique_(arr) {
  return [...new Set(arr)];
}

function safeNotify_(msg) {
  try { SpreadsheetApp.getUi().alert(msg); }
  catch (e) { Logger.log(msg); }
}

function scoreTeacherLine_(line) {
  const t = String(line || '');
  let score = 0;
  if (/레슨평가:/.test(t)) score += 5;
  if (/현재진행상태:/.test(t)) score += 4;
  if (/수업내용:/.test(t)) score += 3;
  if (/수업곡:/.test(t)) score += 1;
  if (/(템포|리듬|코드|발성|호흡|필인|클릭|메트로놈|곡|연결|반복|자세|손가락|소리|음정)/.test(t)) score += 3;
  score += Math.min(5, Math.floor(t.length / 80));
  return score;
}

function pickDiverseSeedLines_(cleaned, count) {
  const scored = (cleaned || [])
    .map(t => ({ t: String(t || '').trim(), sc: scoreTeacherLine_(t) }))
    .filter(item => item.t)
    .sort((a, b) => b.sc - a.sc);

  const picked = [];
  for (const item of scored) {
    if (picked.length >= count) break;
    const tooSimilar = picked.some(p => lineSimilarity_(p, item.t) > 0.6);
    if (!tooSimilar) picked.push(item.t);
  }

  if (picked.length < count) {
    for (const item of scored) {
      if (picked.length >= count) break;
      if (picked.indexOf(item.t) === -1) picked.push(item.t);
    }
  }
  return picked;
}

function lineSimilarity_(a, b) {
  const sa = new Set(String(a || '').replace(/\s+/g, ' ').split(' ').filter(Boolean));
  const sb = new Set(String(b || '').replace(/\s+/g, ' ').split(' ').filter(Boolean));
  if (!sa.size || !sb.size) return 0;
  const inter = [...sa].filter(x => sb.has(x)).length;
  const union = new Set([...sa, ...sb]).size;
  return union ? inter / union : 0;
}

/* ========= 이하 누락 대비용 테스트 함수 ========= */
function testOpenAIKey_() {
  const key = getOpenAIKey_();
  Logger.log(key ? 'OPENAI_API_KEY OK' : 'NO KEY');
}

/* ========= Blogmain compatibility aliases ========= */
function menuRunA() { menuRunAnyang(); }
function menuRunS() { menuRunSuwon(); }

/* ========= End ========= */
