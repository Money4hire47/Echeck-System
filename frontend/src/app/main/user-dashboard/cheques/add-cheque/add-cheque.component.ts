import { Component, OnInit, ViewChild } from '@angular/core';
import { UserAccountService } from 'src/app/_services/user-account.service';
import { UserCompanyService } from 'src/app/_services/user-company.service';
import { UserCheckService } from 'src/app/_services/user-check.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
// import * as domtoimage from 'dom-to-image'; // html to Image
// import domtoimage from 'dom-to-image-more';
import htmlToImage from 'html-to-image';
import numbo from 'numbo'; // number to letters
import { RecieverService } from 'src/app/_services/reciever.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import 'hammerjs';
import { NguCarouselConfig } from '@ngu/carousel';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/ngx-bootstrap-datepicker';
import { UserService } from 'src/app/_services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-add-cheque',
  templateUrl: './add-cheque.component.html',
  styleUrls: ['./add-cheque.component.css']
})
export class AddChequeComponent implements OnInit {
  checkModel: any = {};
  bankAccounts: any[] = [];
  companies: any[] = [];
  signatures: any[] = [];
  bankLogos: any[] = [];
  recievers: any[] = [];
  backgrounds: any[] = [];
  docs: any[] = [];

  selectedCompany: any = {};
  selectedbankAccount: any = {};
  wordsAmount = '';
  recieverName = '';
  isCompany: boolean;
  fileUpload: boolean;
  user: any = {};
  messageAlert = false;

  documentName: any;

  secondSignImage: any;

  public docTiles: NguCarouselConfig = {
    grid: { xs: 3, sm: 3, md: 3, lg: 4, all: 0 },
    slide: 3,
    speed: 250,
    point: {
      visible: true
    },
    load: 3,
    velocity: 0,
    touch: true,
    easing: 'cubic-bezier(0, 0, 0.2, 1)'
  };

  // date picker

  colorTheme = 'theme-blue';

  bsConfig: Partial<BsDatepickerConfig>;
  checkBackgroundPreview: any; // check baground Image
  flipCheck = false;
  @ViewChild('checkContainer') container;
  @ViewChild('canvas') canvasBody;

  checkImageFile: any;

  chequeBackground = '../../../../../assets/cheque-background/default.jpg';
  isBackSelected = false;
  constructor(
    private recieverService: RecieverService,
    private accountService: UserAccountService,
    private userService: UserService,
    private companyService: UserCompanyService,
    private checkService: UserCheckService,
    private ngxModalService: NgxSmartModalService,
    private router: Router,
    private toastr: ToastrService,
    private ngxUiLoaderService: NgxUiLoaderService
  ) {}

  ngOnInit() {
    this.getCurrentUserById();
    this.getCheckIssuedNumber();
    this.getBankAccounts();
    this.getCompanies();
    this.getSignatures();
    this.getReceivers();
    this.getCheckBackgrounds();
    this.getDocumnets();
    this.getBankLogos();

    // date picker

  this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });


  }

  getDocumnets() {
    this.checkService.getuserDocumnets().subscribe(result => {
      this.docs = result.data;

    }, err => {
      console.log(err);
    });
  }


  getCurrentUserById() {
    this.userService.getUserProfile().subscribe(
      result => {
        this.user = result.profile;
        console.log(result.profile);
        this.messageAlert = true;
      },
      err => console.log(err)
    );
  }
  getCheckIssuedNumber() {
    this.checkService.getIssuedNumber().subscribe(
      result => {
        // this.checkNumber = result.data;
        this.checkModel.checkNumber = result.data;
        console.log(result.data);
      },
      err => console.log(err)
    );
  }

  getBankAccounts() {
    this.accountService.getBankAccounts().subscribe(
      result => {
        this.bankAccounts = result.data;
        console.log(this.bankAccounts);
      },
      err => {}
    );
  }

  getCompanies() {
    this.companyService.getUserCompany().subscribe(
      result => {
        this.companies = result.data;
      },
      err => {
        console.log(err);
      }
    );
  }

  getSignatures() {
    this.accountService.getSignatures().subscribe(
      result => {
        console.log(result);
        this.signatures = result.data;
      },
      err => console.log(err)
    );
  }

  getReceivers() {
    this.recieverService.getRecievers().subscribe(
      result => {
        this.recievers = result.data;
      },
      err => {
        console.log(err);
      }
    );
  }


  getBankLogos() {
    this.accountService.getBankLogos().subscribe(result => {
      console.log(result);
      this.bankLogos =  result.data;
    }, err => {
      this.toastr.error(err.message);
    });
  }

  getCheckBackgrounds() {
    this.checkService.getBackgrounds().subscribe(
      result => {
        this.backgrounds = result.data;
         this.selectedBackground(this.backgrounds[0].checkBackgroundId);
      },
      err => console.log(err.error)
    );
  }
  // Add Check into Database

  async addCheck() {

    this.ngxUiLoaderService.startBackgroundLoader('master'); // Loader Start
    const fileName = this.checkModel.checkNumber;
    await this.convertToImage(fileName);
    this.ngxUiLoaderService.stopBackground(); //    Loader stop
    if (this.checkImageFile) {

    console.log(this.checkImageFile);
    this.checkModel.checkImageFile = this.checkImageFile;

    /* Check is FOr Company or individual */

    // if (this.checkModel.individual) {
    //   this.checkModel.companyId = null;
    // } else {
    //   this.checkModel.individual = false;
    //   this.checkModel.senderName = null;
    //   this.checkModel.senderAddress = null;
    // }

    const formData = new FormData();

    formData.append('checkImage', this.checkModel.checkImageFile); // check image (dom to png)
    formData.append('backgroundImage', this.checkModel.checkBackgroundimage); // check bacground image
    formData.append('secondSignImage', this.checkModel.secondSignImage); // PartnerSign image
    formData.append('senderOnBhalfSign', this.checkModel.senderOnBhalfSign);
    formData.append('checkNumber', this.checkModel.checkNumber);
    formData.append('issuedDate', this.checkModel.issuedDate);
    formData.append('amount', this.checkModel.amount);
    formData.append('checkMemo', this.checkModel.checkMemo);
    formData.append('bankAccountId', this.checkModel.bankAccountId);
    // indivual
    formData.append('individual', this.checkModel.individual);
    formData.append('senderName', this.checkModel.senderName);
    formData.append('senderAddress', this.checkModel.senderAddress);
    // comapny
    if (this.checkModel.companyId) {
    formData.append('companyId', this.checkModel.companyId);
    }
    // reciever
    formData.append('billerId', this.checkModel.billerId);
    // document
    if (this.checkModel.documentId) {
    formData.append('documentId', this.checkModel.documentId);
    }

    // sneder Partner
    if (this.checkModel.senderPartnerEmail) {
    formData.append('senderPartnerEmail', this.checkModel.senderPartnerEmail);
    }

    // checkBackgroundId
    formData.append('checkBackgroundId', this.checkModel.checkBackgroundId);

    this.checkService.saveCheck(formData).subscribe(
      result => {

        this.router.navigate(['/check-history/sent']);
        this.toastr.success('Check Sent');
        console.log(result.data);
      },
      err => {
        this.toastr.error(err.error.message);
      }
    );

  } else {
    console.log('dom to image is not working properly');
    this.toastr.error('Please Try Again !');
  }

  }

  onChangeCompany(id) {
    // tslint:disable-next-line:triple-equals
    const comp = this.companies.find(x => x.Id == id);
    this.selectedCompany = {
      companyName: comp.companyName,
      address: comp.companyAddress
    };
  }

  onChangeBankAccount(id) {
    // tslint:disable-next-line:triple-equals
    const account = this.bankAccounts.find(x => x.bankAccountId == id);

    console.log(account);

    if (account.signatureId) {

      // sign image
      const sign = this.signatures.find(
        item => item.signatureId === account.signatureId);


        // bank image
        const bank = this.bankLogos.find(
          item => item.bankLogoId === account.bank.bankLogoId);

          let companyPartner; // check if company has co-signer
          let senderName;
          let senderAddress;
          let senderzipCode;
          if (account.companyId) {
            companyPartner = account.company.hasPartner;
            senderName = account.company.companyName;
            senderAddress = account.company.companyAddress;
            senderzipCode = account.company.zipCode;
          }
          if (account.individualAccount) {
            senderName = this.user.firstName ;
            senderAddress = this.user.address;
            senderzipCode = this.user.zipCode;

          }

      this.selectedbankAccount = {
        isIndividual : account.individualAccount,
        individualPartner : account.isIndividualCoPartner,
        companyPartner : companyPartner,
        senderName: senderName,
        senderAddress: senderAddress,
        senderzipCode: senderzipCode,
        routingNumber: account.bank.routingNumber,
        bankLogo: bank.bankLogo,
        address: account.bank.address,
        city: account.bank.city,
        zipCode: account.bank.zipCode,
        accountNumber: account.accountNumber,
        isSubAccount: account.isSubAccount,
        subAccountNumber: account.subAccountNumber,
        signature: sign.signatureImage
      };

      // if company partner is present then get partner email
      if (companyPartner) {
        this.checkModel.senderPartnerEmail =  account.company.partnerEmail;
      }

      // if individual has co-partner then get partner email
      if (account.isIndividualCoPartner) {
        this.checkModel.senderPartnerEmail =  account.individual_copartner.partnerEmail;
      }

      console.log(this.selectedbankAccount);

    } else {
      this.ngxModalService.open('bankAccountModal');
    }

  }

  onSelfPartnerSignatureChange() {
    this.checkModel.senderPartnerEmail = null;
  }


  onChangeBiller(id) {
    console.log(this.checkModel.billerId);
    // tslint:disable-next-line:triple-equals
    const reciever = this.recievers.find(x => x.recieverId == id);
      console.log(reciever);
      this.recieverName = reciever.recieverName;

  }

  onCheckBackgroundPicked(event) {
    const file = (event.target as any).files[0];
    if (file) {
      this.checkModel.checkBackgroundimage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.checkBackgroundPreview = reader.result; // preview of image & change Check background Image
      };
      reader.readAsDataURL(file);
         this.checkModel.checkBackgroundId = null; // user want to upload new background
       this.isBackSelected = false;
       this.chequeBackground = null;
    }
  }

  onSignImagePicked(event) {
    const file = (event.target as any).files[0];
    if (file) {
      this.checkModel.secondSignImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.secondSignImage = reader.result; // preview of image & change Check background Image
      };
      reader.readAsDataURL(file);

    }
  }

  // onClickBackgroundImage(path) {
  //   this.chequeBackground = path;
  // }

  onClickPersonalInfo(isPersonal) {
    console.log('indiv ' + this.checkModel.individual);
    this.checkModel.isCompany = false;
    if (isPersonal) {
      this.ngxModalService.open('personalInfo');
    }
  }


  onClickCompany(isCompany) {
    console.log('comp ' + this.checkModel.isCompany);
    this.checkModel.individual = false;
    if (isCompany) {
      this.ngxModalService.open('companyDropDown');
    }
  }

  async convertToImage(fileName) {
    try {
      // const dataUrl = await domtoimage.toPng(this.container.nativeElement);
      // this.checkImageFile = dataUrl;

      const blob = await htmlToImage.toBlob(this.container.nativeElement);
      this.checkImageFile = new File([blob], fileName + '.png', {
        type: 'image/png'
      }); // image File

    } catch (error) {
      console.log('ops error', error);
    }
  }

  onClickFlip() {
    this.flipCheck = !this.flipCheck;
  }



  selectedBackground(id) {
      const back = this.backgrounds.find(item => item.checkBackgroundId == id);
      this.checkModel.checkBackgroundId = back.checkBackgroundId;
      // change background of Check
        this.chequeBackground = back.Image;
      // css style
      this.isBackSelected = true;
  }


  selectDocument(id) {
    const document = this.docs.find(item => item.documentId === id);
    this.checkModel.documentId = document.documentId;
    // change background of Check
      this.documentName = document.documentName;

      this.ngxModalService.close('docModal');

}

  convertAmountToWords() {
    this.wordsAmount = numbo.convert(this.checkModel.amount, 'check');
  }


  // checkBackImagePath(){
  //   if (!this.checkBackgroundPreview) {
  //     return {'background-size': '100%'}
  //   } else{
  //     return {'background': 'url(' +this.checkBackgroundPreview+ ') no-repeat 0 0', 'background-size': '100%' }
  //   }
  // }
}
