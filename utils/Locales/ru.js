// TODO: replace with {{min}}
//import { PASS_MIN } from 'Utils/validation';

export default {
  main: {
    promo: {
      title: 'Квалифицированная юридическая помощь',
      subtitle: 'Более {{count}} исполнителей, работающих в различных сферах юриспруденции и права.'
    },
    top: {
      title: 'Лучшие эксперты месяца',
    },
  },
  header: {
    menu: [
      'Задачи',
      'Исполнители',
      'Новости',
      'Вопросы юристам',
      'Помощь'
    ],
  },
  reviews: {
    plural: [
      'Нет отзывов',
      '%d отзыв',
      '%d отзыва',
      '%d отзывов'
    ],
  },
  questions: {
    plural: [
      'Нет вопросов',
      '%d вопрос',
      '%d вопроса',
      '%d вопросов'
    ],
  },
  answers: {
    plural: [
      'Нет ответов',
      '%d ответ',
      '%d ответа',
      '%d ответов'
    ],
  },
  responses: {
    plural: [
      'Нет откликов',
      '%d отклик',
      '%d отклика',
      '%d откликов'
    ],
  },
  menu: {
    // maybe use just array, as header.menu
    user: {
      profile: 'Личный профиль',
      projects: 'Мои проекты',
      requests: 'Мои отклики',
      messages: 'Сообщения',
      finance: 'Финансы'
    }
  },
  icons: {
    errors: {
      notFound: 'Файл не найден: {{fileName}}.svg'
    }
  },
  validation: {
    required: {
      email: 'Введите E-mail !',
      password: 'Введите пароль !',
      confirmPassword: 'Повторите пароль !',
      smscode: 'Введите код из СМС',
      name: 'Введите ваше имя !',
      surname: 'Введите вашу фамилию !',
      phone: 'Введите номер телефона !',
      username: 'Введите имя пользователя !'
    },
    // 'required': `{{label}} is required`,
    'min-chars': `Разрешено минимум 8 символов`,
    // 'min-chars': `Min {{min}} characters`,
    'no-spaces': `Не должен содержать пробелы`,
    'digits': 'Должен содержать хотя бы одну цифру',
    'lowercased': 'Должен содержать хотя бы строчную букву',
    'uppercased': 'Должен содержать хотя бы одну заглавную букву',
    'special-chars': 'Должен содержать хотя бы один специальный символ !"№%:,.;( и тд',
    'agree': 'Пожалуйста, прочитайте и примите условия пользовательского соглашения',
    'e-mail': 'Неправильно введен E-mail !',
    'digits-only': 'Должен содержать только цифры !' ,
    confirmPassword: 'Введенные пароли не совпадают!' 
  },
  headers: {
    login: 'Вход в личный кабинет',
    registration: 'Регистрация',
    requests: 'Мои отклики',
    messages: 'Сообщения',
    finance: 'Финансы',
    recovery: 'Восстановление пароля',
    sendLink: 'На ваш e-mail будет отправлена ссылка для восстановления пароля.',
    news: 'Новости',
    lastnews: 'Последние новости',
    partnersnews: 'Новости партнеров',
    similarnews: 'Похожие новости',
    comments: 'Комментарии',
    personalInfo: 'Личная информация',
    categoriesOfLaw: 'Категории права',
    serviсesAndPrices: 'Услуги и цены',
    experience: 'Опыт работы',
    documents: 'Документы',
    requisites: 'Реквизиты',
    changePassword: 'Смена пароля',
    personalProfile: 'Личный профиль',
    addEducation: 'Добавить образование',
    myProfile: 'Мой профиль',
    myProjects: 'Мои проекты',
    myReplays: 'Мои отклики',
    messages: 'Сообщения',
    finances: 'Финансы',
    questions: 'Вопросы и ответы',
    haveQuestion: 'Есть вопрос к специалистам?',
    askQuestionText: 'Мы всегда готовы прийти на помощь по любым вопросам, связаным с юриспруденцией',
    specialization: 'Специализация',
    lawBranches: 'Отрасли права',
    haveAnswer: 'Знаете ответ на этот вопрос?',
    leaveAnswerText: 'Нам всегда приятно знать мнение профессионалов из сообщества',
    tasks: 'Задачи',
    experts: 'Специалисты',
    personalaccount: 'Личный кабинет',

  },
  labels: {
    password: 'Пароль',
    confirmPassword: 'Повторите пароль',
    smscode: 'код из СМС',
    phone: 'Номер телефона',
    loginSocNW: 'Войти через соцсеть',
    forgotPassword: 'Забыли пароль?',
    dontHaveAccount: "Еще нет аккаунта?",
    passwordInfo: 'Пароль должен состоять минимум из 8 символов и содержать заглавные и прописные латинские буквы, цифры и спецсимволы (!@#$%^&*)',
    codeInfo: 'Введите пятизначный код из СМС',
    name: 'Имя',
    surname: 'Фамилия',
    haveAccount: 'Уже есть аккаунт?' ,
    shown: 'Показано',
    from: 'из',
    category: 'Категория',
    share: 'Поделиться',
    haveAccount: 'Уже есть аккаунт?',
    dateOfBirth: 'Дата рождения',
    sex: 'Пол',
    male: 'Мужской',
    female: 'Женский',
    aboutYou: 'О себе',
    areYouSure: 'Вы уверены?',
    verifyEmail: 'Подтвердите E-mail',
    emailVerified: 'E-mail подтвержден',
    verificationAlert: 'На указанный Вами адрес электронной почты отправлена ссылка для подтверждения',
    dateFormat: 'ГГГГ-ММ-ДД',
    education: 'Образование',
    yearsOfExperience: 'Стаж, лет',
    categoriesHint: 'Укажите отрасли права, с которыми вы работаете',
    branchName: 'Название отрасли',
    serviceDescription: 'Название услуги',
    price: 'Цена, ₽',
    addService: 'Добавить услугу',
    deleteBlock: 'Удалить блок',
    deleteRow: 'Удалить строку',
    arbitrationLaw: 'Арбитражное право',
    familyLaw: 'Семейное право',
    corporateLaw: 'Корпоративное право',
    civilLaw: 'Гражданское право',
    laborLaw: 'Трудовое право',
    commercialLaw: 'Торговое право',
    withoutDiploma: 'Без диплома',
    diplomaSpecialist: 'Дипломированный специалист',
    bachelor: 'Бакалавр',
    magistr: "Магистр",
    deleteBlockMsg: 'Вы хотите удалить эту отрасль и все связанные с ней услуги?',
    university: 'ВУЗ',
    city: 'Город',
    graduationYear: 'Год окончания',
    specialization: 'Специальность',
    uploadScanDiploma: 'Загрузить скан диплома',
    uploadScanHint:  'Отсканируйте или сфотографируйте документы, подтверждающие вашу квалификацию. Файлы в формате jpg, jpeg, png, pdf размером до 10Мб.',
    uploadPassportHint: 'Нам необходим ваш паспорт для прохождения верификации. Отсканируйте или сфотографируйте первую страницу паспорта с фото. Файл в формате jpg, jpeg, png, pdf размером до 10Мб.',
    checkingPassport: 'Ваши документы находятся на проверке. Проверка занимает до 5 рабочих дней.',
    naturalPerson: 'Физлицо',
    legalEntity: 'Юрлицо',
    taxNumber: 'ИНН',
    bank: "Банк получателя",
    paymentAccount: 'Р/с',
    correspondentAccount: 'К/с',
    bic: 'БИК',
    postalAddress: 'Почтовый адрес',
    legalEntityName: 'Название юрлица',
    stateRegistrationNum: 'ОГРН/ОГРНИП',
    currentPass: 'Текущий пароль',
    newPass: 'Новый пароль',
    repeatPass: 'Повторите пароль',
    currentPassHint: 'Введите текущий пароль',
    profile: 'Профиль',
    fillupDescr: 'Не все разделы профиля заполнены',
    filledUp: 'Все разделы профиля заполнены',
    anyQuestions: 'Возникли вопросы?',
    weWillHelp: 'Мы всегда рады помочь, если вы столкнулись с проблемой',
    budget: "Бюджет",
    catPrava: "Отрасль права",
    lookTask: 'Ищу задачу',
    tasks: 'Задачи',
    lookExpert: 'Ищу исполнителя' ,
    experts: 'Эксперты',
    speciality: 'Специальность',
    username: 'Имя пользователя',
    information: "Информация",
    feedbacks: 'Отзывы',
    aboutYou: 'О себе',
    aboutOrganization: 'Об организации'
  },
  links: {
    register: 'Зарегистрироваться',
    getSmsCode: 'Получить код',
    loginWithEmail: 'Войти с E-mail',
    loginWithPhone: 'Войти с номером телефона',
    login: 'Войти в личный кабинет',
    uploadPhoto: 'Загрузить фото',
    editPhoto: 'Изменить фото',
    deletePhoto: 'Удалить фото',
    uploadDocument: 'Загрузить документ',
    docChecking: 'Паспорт на проверке',
    docsChecked: 'Ваш паспорт успешно проверен',
    allnews: 'Все новости',
    allExperts: 'Все эксперты',
    loginWithUserName: 'Войти с именем пользователя'

  },
  buttons: {
    login: 'ВОЙТИ',
    headerBtn: 'Вход/Регистрация',
    mobileheaderBtn: 'Вход',
    registration: 'Зарегистрироваться',
    recovery: 'Восстановить пароль',
    prev: 'Предыдущие',
    next: 'Следующие',
    leaveComment: 'Оставить комментарий',
    answer: "Ответить",
    logoff: "Выйти",
    save: 'Сохранить',
    cancel: 'Отмена',
    add: 'Добавить',
    delete: 'Удалить',
    deleteDocument: 'Удалить документ',
    writeUs: 'Напишите нам',
    findTask: 'Найти задачу',
    findExpert: 'Найти исполнителя',
    askQuestion: 'Задать вопрос',
    resetFilter: 'Сбросить фильтр',
    expandComments: 'Развернуть комментарии',
    collapseComments: 'Свернуть комментарии',
    save: 'Сохранить',
    answerQuestion: 'Ответить на вопрос',
    responseTask: 'Откликнуться на задачу',
    editTask: 'Редактировать задачу',
    confirmTask: 'Потдвердить участие'
  },
  placeholders: {
    search: "Введите текст для поиска",
    selectCategory: "Выберите категорию",
    searchExperts: "Введите полностью или частично имя или фамилию"
  }


}