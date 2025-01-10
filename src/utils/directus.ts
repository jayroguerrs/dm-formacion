import {
  createDirectus,
  readAssetRaw,
  rest,
  staticToken,
  type AssetsQuery,
} from '@directus/sdk';

export type SiteConfig = {
  siteName: string;
  logoHeader: string;
  logoFooter: string;
  infoEmail: string;
  phoneNumber: string;
  socialNetworks: number[] | SocialNetwork[];
  seoDescription: string;
  seoTwitterAccount: string;
  seoImage: string;
  footerText: string;
  whatsappNumber: string;
};
export type HomeConfig = {
  showMainBanner: boolean;
  showInternalCourses: boolean;
  showExternalCourses: boolean;
  showEvents: boolean;
  showWhatIsDM: boolean;
  showWhyDM: boolean;
  showAlliances: boolean;
  showHowItWorks: boolean;
  showReviews: boolean;
  showBenefits: boolean;
};
export type CoursesConfig = {
  showInternalCoursesBanner: boolean;
  showExternalCoursesBanner: boolean;
  showInternalCourses: boolean;
  showExternalCourses: boolean;
  showBenefits: boolean;
  labelGeneralAdmission: string;
  labelPartner: string;
  labelContracted: string;
  labelDiscountPartner: string;
  labelDiscoundContracted: string;
  labelPriceGeneralAdmission: string;
  enrollButtonTextCard: string;
  enrollButtonTextDetail: string;
  enrollButtonTextLanding: string;
};
export type EventsConfig = {
  showMainBanner: boolean;
  showUpcomingEvents: boolean;
  showPastEvents: boolean;
};
export type SocialNetwork = {
  id: number;
  title: string;
  url: string;
  icon: string;
  siteConfigId: number;
};
export type ContactInfo = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentType: string;
  document: string;
  authorizationGetInfo: boolean;
  course: string;
};
export type InternalCourse = {
  id: string;
  status: string;
  featured: boolean;
  title: string;
  slug: string;
  image: string;
  video: string;
  start: 'datetime';
  duration: string;
  generalAdmission: boolean;
  partner: boolean;
  contracted: boolean;
  price: number;
  partnerPrice: number;
  contractedPrice: number;
  credits: number;
  modality: string;
  type: string;
  classDays: string;
  sessions: number;
  shortDescription: string;
  longDescription: string;
  target: string;
  certifier: number | Certifier;
  curriculum: number[] | CourseCurriculum[];
  professors: number[] | InternalCourse_Professor[];
  reasons: number[] | ImageTextBlock[];
  reasonsImage: string;
  comments: number[] | InternalCourse_Review[];
  showImageInDetail: boolean;
  showVideoInDetail: boolean;
  showLongDescriptionInDetail: boolean;
  showCertifierInDetail: boolean;
  showStartDateInDetail: boolean;
  showStartTimeInDetail: boolean;
  showSessionsInDetail: boolean;
  showDurationInDetail: boolean;
  showModalityInDetail: boolean;
  showClassDaysInDetail: boolean;
  showCurriculumInDetail: boolean;
  showProfessorsInDetail: boolean;
  showCommentsInDetail: boolean;
  showBenefitsInDetail: boolean;
  showShortDescriptionInLanding: boolean;
  showCertifierInLanding: boolean;
  showCreditsInLanding: boolean;
  showDurationInLanding: boolean;
  showModalityInLanding: boolean;
  showStartDateInLanding: boolean;
  showLongDescriptionInLanding: boolean;
  showTargetInLanding: boolean;
  showCurricullumInLanding: boolean;
  showProfessorsInLanding: boolean;
  showReviewsInLanding: boolean;
  showWhyWithUsInLanding: boolean;
  showEnrollButton: boolean;
};
export type Certifier = {
  id: number;
  name: string;
  logo: string;
  detailText: string;
};
export type CourseCurriculum = {
  id: number;
  title: string;
  description: string;
};
export type ExternalCourse = {
  id: string;
  status: string;
  featured: boolean;
  title: string;
  image: string;
  start: 'datetime';
  duration: string;
  generalAdmission: boolean;
  partner: boolean;
  price: number;
  partnerPrice: number;
  type: string;
  url: string;
  provider: number | Provider;
};
export type Provider = {
  id: number;
  name: string;
  logo: string;
};
export type HomeBanner = {
  title: string;
  image: string;
  imageMobile: string;
  body: string;
  buttonText: string;
  buttonUrl: string;
};
export type WhatIsDM = {
  title: string;
  body: string;
  buttonText: string;
  buttonUrl: string;
  stat1Icon: string;
  stat1Label: string;
  stat1Value: string;
  stat2Icon: string;
  stat2Label: string;
  stat2Value: string;
  stat3Icon: string;
  stat3Label: string;
  stat3Value: string;
};

export type WhyWithDM = {
  title: string;
  image: string;
  reasons: TextBlock[];
};

export type TextBlock = {
  body: string;
};

export type Alliance = {
  id: number;
  status: string;
  name: string;
  logo: string;
};

export type HowItWorks = {
  title: string;
  section1Image: string;
  section1Title: string;
  section1Body: string;
  section2Image: string;
  section2Title: string;
  section2Body: string;
  section3Image: string;
  section3Title: string;
  section3Body: string;
};
export type BenefitsBanner = {
  title: string;
  body: string;
  image: string;
};

export type Review = {
  id: number;
  featured: boolean;
  body: string;
  studentName: string;
  studentDetail: string;
  studentImage: string;
};

export type Event = {
  id: string;
  featured: boolean;
  status: string;
  title: string;
  modality: string;
  description: string;
  start: 'datetime';
  end: 'datetime';
  image: string;
  url: string;
  images: number[] | ImageBlock[];
  videos: number[] | VideoBlock[];
  files: string[] | File[];
};

export type ImageBlock = {
  id: number;
  image: string;
};

export type VideoBlock = {
  id: number;
  video: string;
};

export type File = {
  oid: number;
  directus_files_id: string;
};

export type TitleBodyBlock = {
  id: number;
  title: string;
  body: string;
};

export type About = {
  body: string;
  image: string;
  faq: number[] | About_TitleBodyBlock[];
};

export type About_TitleBodyBlock = {
  id: number;
  about_id: number | About;
  titleBodyBlock_id: number | TitleBodyBlock;
};
export type Professor = {
  id: number;
  name: string;
  image: string;
  profession: string;
  linkedin: string;
  description: string;
  descriptionList: string;
};
export type InternalCourse_Professor = {
  id: number;
  internalCourse_id: string | InternalCourse;
  professor_id: number | Professor;
};
export type InternalCourse_Review = {
  id: number;
  internalCourse_id: string | InternalCourse;
  review_id: number | Review;
};
export type ImageTextBlock = {
  id: number;
  image: string;
  text: string;
};
export type TermsConditions = {
  image: string;
  body: string;
};
export type Subscriber = {
  email: string;
};
export type Certificate = {
  code: string;
  firstName: string;
  lastName: string;
  secondLastName: string;
  courseName: string;
  courseStart: string;
  courseEnd: string;
};
export type Testimony = {
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  image5: string;
  image6: string;
};

export type Order = {
  id: number;
  user: string;
  currency: string;
  amount: number;
  discount: number;
  courses: number[] | Order_IntenalCourse[];
  transactions: string[] | Transaction[];
  status: string;
};

export type Order_IntenalCourse = {
  id: number;
  order_id: number;
  internalCourse_id: string;
  amount: number;
  discount: number;
  quantity: number;
  addedDate: 'datetime' | string;
};

export type Transaction = {
  id: string;
  transactionId: string;
  responseCode: string;
  responseMessage: string;
  payMethod: string;
  signature: string;
  cardBrand: string;
  cardNumber: string;
  merchantCode: string;
  facilitatorCode: string;
  currency: string;
  amount: string;
  transactionDate: 'datetime' | string;
  codeAuth: string;
  uniqueId: string;
  referenceNumber: string;
  orderId: number;
  billingFirstName: string;
  billingLastName: string;
  billingDocumentType: string;
  billingDocument: string;
  billingEmail: string;
  billingPhoneNumber: string;
  billingStreet: string;
  billingState: string;
  billingCity: string;
  billingPostalCode: string;
  billingCountry: string;
  billingCompanyName: string;
  payloadHttp: string;
  savedFromUI: boolean;
  savedFromIPN: boolean;
};

export type Directus_User = {
  first_name: string;
  last_name: string;
  email: string;
  document: string;
  phone: string;
  courses: number[] | Users_InternalCourse[];
  type: string;
  billingAddressDocumentType: string;
  billingAddressDocument: string;
  companyName: string;
  street: string;
  state: string;
  city: string;
  postalCode: string;
};

export type Users_InternalCourse = {
  id: number;
  internalCourse_id: string;
  directus_user_id: string;
  order_id: number;
};

export type NavItem = {
  id: number;
  label: string;
  href: string;
  blank: boolean;
  enabled: boolean;
};

export type MainMenu = {
  items: number[] | NavItem[];
};

export type ValidatorConfig = {
  image: string;
};

type Schema = {
  directus_users: Directus_User[];
  junction_directus_users_internalCourse: Users_InternalCourse[];
  order: Order[];
  order_internalCourse: Order_IntenalCourse[];
  transaction: Transaction[];
  siteConfig: SiteConfig;
  homeConfig: HomeConfig;
  coursesConfig: CoursesConfig;
  eventsConfig: EventsConfig;
  homeBanner: HomeBanner;
  socialNetworks: SocialNetwork[];
  internalCourse: InternalCourse[];
  certifier: Certifier[];
  courseCurriculum: CourseCurriculum[];
  externalCourse: ExternalCourse[];
  courseProvider: Provider[];
  whatIsDM: WhatIsDM;
  whyWithDM: WhyWithDM;
  textBlock: TextBlock[];
  alliance: Alliance[];
  howItWorks: HowItWorks;
  benefitsBanner: BenefitsBanner;
  review: Review[];
  event: Event[];
  imageBlock: ImageBlock[];
  videoBlock: VideoBlock[];
  titleBodyBlock: TitleBodyBlock[];
  about: About;
  about_titleBodyBlock: About_TitleBodyBlock[];
  professor: Professor[];
  internalCourse_professor: InternalCourse_Professor[];
  internalCourse_review: InternalCourse_Review[];
  imageTextBlock: ImageTextBlock[];
  contactInfo: ContactInfo[];
  termsConditions: TermsConditions;
  subscriber: Subscriber[];
  certificate: Certificate[];
  testimony: Testimony;
  navItem: NavItem[];
  mainMenu: MainMenu;
  validatorConfig: ValidatorConfig;
};

export const directus = createDirectus<Schema>(import.meta.env.CMS_URL)
  .with(staticToken(import.meta.env.DIRECTUS_TOKEN))
  .with(rest());

export const directusImage = async (
  fileId: string,
  options: AssetsQuery = {}
) => {
  const stream = await directus.request(readAssetRaw(fileId, options));
  const reader = stream.getReader();
  let chunks = [];
  let done = false;

  while (!done) {
    const { value, done: streamDone } = await reader.read();
    done = streamDone;
    if (value) {
      chunks.push(value);
    }
  }

  // Step 2: Combine chunks into a single Uint8Array
  const arrayBuffer = new Uint8Array(
    //@ts-ignore
    chunks.reduce((acc, chunk) => acc.concat(Array.from(chunk)), [])
  );

  // Step 3: Convert the Uint8Array to a binary string
  let binary = '';
  for (let i = 0; i < arrayBuffer.length; i++) {
    binary += String.fromCharCode(arrayBuffer[i]);
  }

  // Step 4: Encode the binary string to Base64
  const base64 = btoa(binary);

  // @ts-ignore
  return `data:image/${options.format || 'jpeg'};base64,${base64}`;
};

export const directusFileURL = (
  fileId: string,
  params: {
    width?: number;
    height?: number;
    format?: string;
    quality?: number;
    fit?: string;
  } = {}
) => {
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, value.toString()])
    )
  ).toString();
  return `${import.meta.env.CMS_URL}/assets/${fileId}${query ? `?${query}` : ''}`;
};
