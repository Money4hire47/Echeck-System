
const User = require("../models/user");
const Reciever = require("../models/reciever");
const Company = require("../models/company");
const Signature = require("../models/user-signature");
const Bank = require("../models/bank");
const BankAccount = require("../models/bank-account");
const BankAccountType = require("../models/bankaccount-type");
const Token = require("../models/token");
const Check = require("../models/check");
const CheckImage = require("../models/check-image");
const CheckBackground = require("../models/check-background");
const KYC = require("../models/kyc");
const KycType = require("../models/kyc-type");
const Document = require("../models/user-document");
const BankLogo = require("../models/bank-logo");
const UserBank = require("../models/user-bank");
const IndividualCoPartner = require("../models/individual-copartner");
const Slider = require("../models/slider");


// Data

const kycTypes = [
  {
    'kycType': 'Proof of Identity',
    'kycTypeDescription': 'Passport, Drivers License, Adhar, Voter ID',
  },
  {
    'kycType': 'Proof of Address',
    'kycTypeDescription': 'Utility Bill, Cable Bill, Rental Bill, Traffic Tickets, Statement Copies',
  },
];


const sliders = [
  {
    'sliderImage': 'https://www.pay2mate.com/uploads/pay2mate1.jpg'
  },
  {
    'sliderImage': 'https://www.pay2mate.com/uploads/pay2mate2.jpg'
  },
];









const accountTypes = [
  {
    'bankaccountType' : 'Personal Checking',
  },  {
    'bankaccountType' : 'Personal Savings ',
  },  {
    'bankaccountType' : 'Line of Credit',
  },  {
    'bankaccountType' : 'Money Market',
  },  {
    'bankaccountType' : 'Business Checking',
  },  {
    'bankaccountType' : 'Business Savings',
  },  {
    'bankaccountType' : 'Home Equity Loan',
  },  {
    'bankaccountType' : 'Business Loan',
  },  {
    'bankaccountType' : 'Personal Loan',
  }
];


exports.allTableRealtions = () => {




// -------User & Token
User.hasOne(Token,{foreignKey: 'userId'});
Token.belongsTo(User, {foreignKey: "userId"});
// -----------------------------

// -------User & KYC
User.hasMany(KYC,{foreignKey: 'userId'});
KYC.belongsTo(User,{foreignKey: 'userId'});
// -----------------------------

// -------KYC & KycVarificationType
KycType.hasMany(KYC,{foreignKey: 'kycTypeId'});
KYC.belongsTo(KycType,{foreignKey: 'kycTypeId'});
// -----------------------------

// -------User & Reciever
User.hasMany(Reciever, {foreignKey : 'userId'});
Reciever.belongsTo(User, {foreignKey : 'userId'});
// -----------------


// -------User & Company
Company.belongsToMany(User, {through:'UserCompany', foreignKey : 'companyId'} ) // Many to Many RelationShip
User.belongsToMany(Company, {through:'UserCompany',foreignKey : 'userId'}) // Many to Many RelationShip
// -----------------



// -------User & Bank
User.belongsToMany(Bank, {through:UserBank, foreignKey : 'userId'} ) // Many to Many RelationShip
Bank.belongsToMany(User, {through:UserBank,foreignKey : 'bankId'}) // Many to Many RelationShip
// --

// ------User and Signature----- Relation define as (1 to many then many 1 to 1...)
User.hasMany(Signature,{foreignKey : 'userId', onDelete: 'cascade'} ); // Will add userId to signature model
Signature.belongsTo(User); // Will also add userId to signature model
//-----------------------------

// ------- User -> Bank_Accounts
User.hasMany(BankAccount,{foreignKey : 'userId', onDelete: 'cascade'});
BankAccount.belongsTo(User,{foreignKey : 'userId'});
// ----------------------------


// ------- Bank & BankLogo
BankLogo.hasOne(Bank, {foreignKey : 'bankLogoId'}); //
Bank.belongsTo(BankLogo,{foreignKey : 'bankLogoId'});
// ----------------------



// ------- Bank & Bank_Accounts
Bank.hasMany(BankAccount, {foreignKey : 'bankId', onDelete: 'cascade'}); // Will add userId to Task model
BankAccount.belongsTo(Bank,{foreignKey : 'bankId'});
// ----------------------


// ------- Bank_Accounts -> Signatures
Signature.hasMany(BankAccount,{foreignKey : 'signatureId'});
BankAccount.belongsTo(Signature,{foreignKey : 'signatureId'});
// ----------------------------

// ------- Bank_Accounts -> Signatures
Signature.hasMany(BankAccount,{foreignKey : 'signatureId'});
BankAccount.belongsTo(Signature,{foreignKey : 'signatureId'});
// ----------------------------

// ------- Bank_Accounts -> Company
Company.hasMany(BankAccount,{foreignKey : 'companyId'});
BankAccount.belongsTo(Company,{foreignKey : 'companyId'});
// ----------------------------

// ------- Bank_Accounts -> Individual_CoPartner
IndividualCoPartner.hasMany(BankAccount,{foreignKey : 'coPartnerId'});
BankAccount.belongsTo(IndividualCoPartner,{foreignKey : 'coPartnerId'});
// ----------------------------

// ------- Bank_Accounts -> BankAccountType
BankAccountType.hasMany(BankAccount,{foreignKey : 'accountTypeId'});
BankAccount.belongsTo(BankAccountType,{foreignKey : 'accountTypeId'});
// ----------------------------


//------------- bank_account -> check

BankAccount.hasMany(Check,{foreignKey : 'bankAccountId'});
Check.belongsTo(BankAccount,{foreignKey : 'bankAccountId'});

//------------------------------

//------------- Company -> check
// Company.hasMany(Check,{foreignKey : 'companyId'});
//------------------------------

//------------- Reciever -> check
Reciever.hasMany(Check,{foreignKey : 'billerId'});
Check.belongsTo(Reciever,{foreignKey : 'billerId'});
//------------------------------


//------------- user-> check

User.hasMany(Check,{foreignKey : 'senderId'});
User.hasMany(Check,{foreignKey : 'senderPartnerId'});
User.hasMany(Check,{foreignKey : 'recieverId'});
User.hasMany(Check,{foreignKey : 'recieverPartnerId'});
// Check.belongsTo(User,{foreignKey : 'senderId'});

//------------------------------

//------------- signature -> check

Signature.hasMany(Check,{foreignKey : 'senderPartnerSignId'});
Signature.hasMany(Check,{foreignKey : 'recieverSignId'});
Signature.hasMany(Check,{foreignKey : 'recieverPartnerSignId'});

//------------------------------

//------------- Token -> check
Check.hasOne(Token,{foreignKey: 'checkId'});
//---------------------------------

//------------- CheckBackground -> check
CheckBackground.hasMany(Check,{foreignKey: 'checkBackgroundId'});
Check.belongsTo(CheckBackground,{foreignKey: 'checkBackgroundId'});
//---------------------------------

//------------- CheckImage -> check // check Front and back image
CheckImage.hasOne(Check,{foreignKey: 'CheckImageId'});
Check.belongsTo(CheckImage,{foreignKey: 'CheckImageId'});
//---------------------------------

//------------- User -> CheckBackground
User.hasMany(CheckBackground,{foreignKey: 'userId'});
//---------------------------------

//------------- User -> Document
User.hasMany(Document,{foreignKey: 'userId'});
Document.belongsTo(User,{foreignKey: 'userId'});

//------------- Check -> Document
Document.hasMany(Check,{foreignKey: 'documentId'});
Check.belongsTo(Document,{foreignKey: 'documentId'});



}



exports.seedDatabase = async () =>  {

  try {
    await KycType.bulkCreate(kycTypes);

    await BankAccountType.bulkCreate(accountTypes);

    await Slider.bulkCreate(sliders);


  } catch (error) {

  }


}
