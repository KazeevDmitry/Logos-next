// TODO: replace with {{min}}
//import { PASS_MIN } from 'Utils/validation';

export default {
  main: {
    promo: {
      title: 'Skilled jurists',
      subtitle: 'More than {{count}} experts working in various spheres of jurisprudence and law.'
    },
    top: {
      title: 'Top experts',
    },
  },
  header: {
    // TODO: move to menu.main
    menu: [
      'Tasks',
      'Experts',
      'News',
      'Questions',
      'Help'
    ],
  },
  reviews: {
    plural: [ 'review' ],
  },

  answers: {
    plural: [ 'answers' ],
  },
  responses: {
    plural: [ 'responses' ],
  },
  menu: {
    user: {
      profile: 'My Profile',
      projects: 'My Projects',
      requests: 'My Requests',
      messages: 'Messages',
      finance: 'Finance'
    }
  },
  icons: {
    errors: {
      notFound: 'There is no file: {{fileName}}.svg'
    }
  },
  validation: {
    required: {
      email: 'E-mail is required !',
      password: 'Password is required !',
      confirmPassword: 'Please confirm your password !',
      smscode: 'SMS code is required !',
      name: 'Enter your name !',
      surname: 'Enter your surname !',
      phone: 'Enter your phone number !',
      username: 'Enter user name !'
    },
    // 'required': `{{label}} is required`,
    'min-chars': `Min 8 characters`,
    // 'min-chars': `Min {{min}} characters`,
    'no-spaces': 'No spaces are allowed',
    'digits': 'Must contain digits',
    'lowercased': 'Must contain lowercased letters',
    'uppercased': 'Must contain uppercased letters',
    'special-chars': 'Must contain special characters',
    'agree': 'Please, agree to continue',
    'e-mail': 'The input is not valid E-mail !',
    'digits-only': 'Must contain digits only !',
    confirmPassword: 'The two passwords that you entered do not match!' 
  },
  headers: {
    login: 'Login to your personal account ',
    registration: 'Registration',
    requests: 'Мои отклики',
    messages: 'Сообщения',
    finance: 'Финансы',
    recovery: 'Password recovery',
    sendLink: 'A link to reset your password will be sent to your e-mail. ',
    news: 'News',
    lastnews: 'Latest News',
    partnersnews: 'Partners News',
    similarnews: 'Similar News',
    comments: 'Comments',
    personalInfo: 'Personal Information',
    specialization: 'Specialization',
    categoriesOfLaw: 'Categories of Law',
    serviсesAndPrices: 'Serviсes and Prices',
    experience: 'Experience',
    documents: 'Documents',
    requisites: 'Requisites',
    changePassword: 'Change password',
    personalProfile: 'Personal profile',
    addEducation: 'Add education',
    currentPass: 'Current password',
    newPass: 'New password',
    repeatPass: 'Repeat password',
    currentPassHint: 'Type current password',
    profile: 'Profile',
    fillupDescr: 'Not all sections of the profile are filled in',
    filledUp: 'All sections of the profile are filled in',
    anyQuestions: 'Any questions?',
    weWillHelp: 'Should You faced a problem, we are always willing to help',
    myProfile: 'My Profile',
    myProjects: 'My Projects',
    myReplays: 'My Requests',
    messages: 'Messages',
    finances: 'Finance',
    questions: 'Questions and asnwers',
    haveQuestion: 'Have a question to specialists?',
    askQuestionText: 'We are always ready to help you with any questions related to with jurisprudence',
    specialization: 'Specialization',
    lawBranches: 'Branches of law',
    haveAnswer: 'Do you know the answer to this question?',
    leaveAnswerText: 'We are always pleased to know the opinion of professionals from the community',
    tasks: 'Tasks',
    experts: 'Experts', 
    personalaccount: 'Personal Account',


  },
  labels: {
    password: 'Password',
    confirmPassword: 'Comfirm password',
    smscode: 'SMS code',
    phone: 'Phone number',
    loginSocNW: 'Login via social network',
    forgotPassword: 'Forgot your password ?',
    dontHaveAccount: "Don't have an account yet?",
    passwordInfo: 'The password must be at least 8 characters long and contain uppercase and lowercase Latin letters, numbers and special characters (! @ # $% ^ & *)',
    codeInfo: 'Enter a five-digit SMS code',
    haveAccount: 'Already have an account?',
    shown: 'Shown',
    from: 'from',
    category: 'Category',
    share: 'Share',
    haveAccount: 'Already have an account?',
    dateOfBirth: 'Date of Birth',
    sex: 'Sex',
    male: 'Male',
    female: 'Female',
    aboutYou: 'About yourself',
    areYouSure: 'Are You sure?',
    verifyEmail: 'Verify E-mail',
    emailVerified: 'E-mail verified',
    verificationAlert: 'Verification link has been sent to Your E-mail',
    dateFormat: 'YYY-MM-DD',
    education: 'Education',
    yearsOfExperience: 'Years of experience',
    categoriesHint: 'Select categories, which You work with',
    branchName: 'Branch name',
    serviceDescription: 'Service description',
    price: 'Price, $',
    addService: 'Add service',
    deleteBlock: 'Delete block',
    deleteRow: 'Delete row',
    arbitrationLaw: 'Arbitration law',
    familyLaw: 'Family law',
    corporateLaw: 'Corporate law',
    civilLaw: 'Civil law',
    laborLaw: 'Labor law',
    commercialLaw: 'Commercial law',
    withoutDiploma: 'Without a diploma',
    diplomaSpecialist: 'Certified specialist',
    bachelor: 'Bachelor',
    magistr: "Master's  degree",
    deleteBlockMsg: 'You are about to delete this branch and all related services. Are You sure?',
    university: 'University/Colledge',
    city: 'City',
    graduationYear: 'Graduation year',
    specialization: 'Specialization',
    uploadScanDiploma: 'Upload scan copy of Your diploma',
    uploadScanHint: 'Scan or take a picture of the documents, justifying Your qualification. Files of jpg, jpeg, png, pdf format, up to 10Mb size.',
    uploadPassportHint: 'We need your passport to pass verification. Scan or take a picture of the first page of the passport with a photo. File in jpg, jpeg, png, pdf format up to 10Mb in size.',
    checkingPassport: 'Your documents are being checked. It may take up to 5 working days.',
    naturalPerson: 'Natural person',
    legalEntity: 'Legal entity',
    name: 'Name',
    surname: 'Surname',
    taxNumber: 'Tax number',
    bank: "Recipient's Bank",
    paymentAccount: 'Payment account',
    correspondentAccount: 'Correspondent account',
    bic: 'BIC',
    postalAddress: 'Postal address',
    legalEntityName: 'The legal entity name',
    stateRegistrationNum: 'State registration number',
    budget: "Budget",
    catPrava: "Branch of law",
    lookTask: 'Looking for task',
    tasks: 'Tasks',
    lookExpert: 'Lookig for expert',
    experts: 'Experts',
    speciality: 'Speciality',
    username: 'User name',
    information: "Information",
    feedbacks: 'Feedbacks',
    aboutYou: 'About you',
    aboutOrganization: 'About organization'
  },
  links: {
    register: 'Register',
    getSmsCode: 'Get the code',
    loginWithEmail: 'Login with E-mail',
    loginWithPhone: 'Login with phone number',
    login: 'Login to your personal account ',
    uploadPhoto: 'Upload photo',
    editPhoto: 'Edit photo',
    deletePhoto: 'Delete photo',
    addBranch: 'Add branch',
    uploadDocument: 'Upload document',
    docChecking: 'Passport is being checked',
    docsChecked: 'Your passport has been checked successfully',
    allnews: 'All news',
    allExperts: 'All experts',
    loginWithUserName: 'Login with user name'
  },
  buttons: {
    login: 'LOGIN',
    headerBtn: 'Login/Registration',
    mobileheaderBtn: 'Login',
    registration: 'Register',
    recovery: 'Restore password',
    prev: 'Previous',
    next: 'Next',
    leaveComment: 'Leave a comment',
    answer: "Answer",
    logoff: "Logoff",
    save: 'Save',
    cancel: 'Cancel',
    add: 'Add',
    delete: 'Delete',
    deleteDocument: 'Delete document',
    writeUs: 'Write us',
    findTask: 'Find task',
    findExpert: 'Find expert',
    askQuestion: 'Ask a question',
    resetFilter: 'Reset filter',
    expandComments: 'Expand comments',
    collapseComments: 'Collapse comments',
    save: 'Save',
    answerQuestion: 'Answer the question',
    responseTask: 'Respond to a task',
    editTask: 'Edit task',
    confirmTask: 'Confirm participation'
  },
  placeholders: {
    search: "Input search text",
    selectCategory: "Select a category",
    searchExperts: "Enter full or partial first or last name"
  }
}