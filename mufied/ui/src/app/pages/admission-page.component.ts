import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdmissionApiService } from '../services/admission-api.service';

const DEFAULT_EXAM_CENTER_VENUE = 'Mannaniyya Umarul Farooq Academy Kilikolloor, Kollam';
const DEFAULT_EXAM_DATE = '2026-04-11';
const ADMISSION_DRAFT_STORAGE_KEY = 'mufied-admission-draft';
const ADMISSION_OPTIONS = ['Foundation course Class 4-7 (HIFZ)', 'Secondary (8-10)', 'Higher Secondary'] as const;
const INDIA_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
] as const;
const DISTRICTS_BY_STATE: Record<string, readonly string[]> = {
  'Andhra Pradesh': ['Alluri Sitharama Raju', 'Anakapalli', 'Anantapur', 'Annamayya', 'Bapatla', 'Chittoor', 'Dr. B.R. Ambedkar Konaseema', 'East Godavari', 'Eluru', 'Guntur', 'Kakinada', 'Krishna', 'Kurnool', 'Nandyal', 'NTR', 'Palnadu', 'Parvathipuram Manyam', 'Prakasam', 'Srikakulam', 'Sri Potti Sriramulu Nellore', 'Sri Sathya Sai', 'Tirupati', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'],
  'Arunachal Pradesh': ['Anjaw', 'Bichom', 'Changlang', 'Dibang Valley', 'East Kameng', 'East Siang', 'Kamle', 'Keyi Panyor', 'Kra Daadi', 'Kurung Kumey', 'Leparada', 'Lohit', 'Longding', 'Lower Dibang Valley', 'Lower Siang', 'Lower Subansiri', 'Namsai', 'Pakke-Kessang', 'Papum Pare', 'Shi Yomi', 'Siang', 'Tawang', 'Tirap', 'Upper Siang', 'Upper Subansiri', 'West Kameng', 'West Siang'],
  Assam: ['Bajali', 'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo', 'Chirang', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao', 'Goalpara', 'Golaghat', 'Hailakandi', 'Hojai', 'Jorhat', 'Kamrup', 'Kamrup Metropolitan', 'Karbi Anglong', 'Karimganj', 'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 'Sivasagar', 'Sonitpur', 'South Salmara-Mankachar', 'Tamulpur', 'Tinsukia', 'Udalguri', 'West Karbi Anglong'],
  Bihar: ['Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar', 'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran'],
  Chhattisgarh: ['Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur', 'Bilaspur', 'Dantewada', 'Dhamtari', 'Durg', 'Gariaband', 'Gaurela-Pendra-Marwahi', 'Janjgir-Champa', 'Jashpur', 'Kabirdham', 'Kanker', 'Khairagarh-Chhuikhadan-Gandai', 'Kondagaon', 'Korba', 'Korea', 'Mahasamund', 'Manendragarh-Chirmiri-Bharatpur', 'Mohla-Manpur-Ambagarh Chowki', 'Mungeli', 'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Sakti', 'Sarangarh-Bilaigarh', 'Sukma', 'Surajpur', 'Surguja'],
  Goa: ['North Goa', 'South Goa'],
  Gujarat: ['Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka', 'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad', 'Vav-Tharad'],
  Haryana: ['Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram', 'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh', 'Nuh', 'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar'],
  'Himachal Pradesh': ['Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu', 'Lahaul and Spiti', 'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una'],
  Jharkhand: ['Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum', 'Garhwa', 'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti', 'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Ranchi', 'Sahibganj', 'Seraikela Kharsawan', 'Simdega', 'West Singhbhum'],
  Karnataka: ['Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar', 'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir', 'Vijayanagara'],
  Kerala: ['Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'],
  'Madhya Pradesh': ['Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 'Betul', 'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda', 'Indore', 'Jabalpur', 'Jhabua', 'Katni', 'Khandwa', 'Khargone', 'Mandla', 'Mandsaur', 'Morena', 'Narmadapuram', 'Narsinghpur', 'Neemuch', 'Niwari', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni', 'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha', 'Maihar', 'Mauganj', 'Pandhurna'],
  Maharashtra: ['Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'],
  Manipur: ['Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Jiribam', 'Kakching', 'Kamjong', 'Kangpokpi', 'Noney', 'Pherzawl', 'Senapati', 'Tamenglong', 'Tengnoupal', 'Thoubal', 'Ukhrul'],
  Meghalaya: ['East Garo Hills', 'East Jaintia Hills', 'East Khasi Hills', 'Eastern West Khasi Hills', 'North Garo Hills', 'Ri-Bhoi', 'South Garo Hills', 'South West Garo Hills', 'South West Khasi Hills', 'West Garo Hills', 'West Jaintia Hills', 'West Khasi Hills'],
  Mizoram: ['Aizawl', 'Champhai', 'Hnahthial', 'Khawzawl', 'Kolasib', 'Lawngtlai', 'Lunglei', 'Mamit', 'Saiha', 'Saitual', 'Serchhip'],
  Nagaland: ['Chumoukedima', 'Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung', 'Mon', 'Niuland', 'Noklak', 'Peren', 'Phek', 'Shamator', 'Tseminyu', 'Tuensang', 'Wokha', 'Zunheboto'],
  Odisha: ['Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack', 'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kalahandi', 'Kandhamal', 'Kendrapara', 'Kendujhar', 'Khordha', 'Koraput', 'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Rayagada', 'Sambalpur', 'Subarnapur', 'Sundargarh'],
  Punjab: ['Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka', 'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Malerkotla', 'Mansa', 'Moga', 'Mohali', 'Muktsar', 'Pathankot', 'Patiala', 'Rupnagar', 'Sangrur', 'Shaheed Bhagat Singh Nagar', 'Tarn Taran'],
  Rajasthan: ['Ajmer', 'Alwar', 'Anupgarh', 'Balotra', 'Banswara', 'Baran', 'Barmer', 'Beawar', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Deeg', 'Dholpur', 'Didwana-Kuchaman', 'Dudu', 'Dungarpur', 'Ganganagar', 'Gangapur City', 'Hanumangarh', 'Jaipur', 'Jaipur Rural', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Jodhpur Rural', 'Kekri', 'Khairthal-Tijara', 'Kota', 'Kotputli-Behror', 'Nagaur', 'Neem Ka Thana', 'Pali', 'Phalodi', 'Pratapgarh', 'Rajsamand', 'Salumber', 'Sanchore', 'Sawai Madhopur', 'Shahpura', 'Sikar', 'Sirohi', 'Tonk', 'Udaipur'],
  Sikkim: ['Gangtok', 'Gyalshing', 'Mangan', 'Namchi', 'Pakyong', 'Soreng'],
  'Tamil Nadu': ['Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kancheepuram', 'Kanniyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupattur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'],
  Telangana: ['Adilabad', 'Bhadradri Kothagudem', 'Hanamkonda', 'Hyderabad', 'Jagtial', 'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 'Khammam', 'Komaram Bheem Asifabad', 'Mahabubabad', 'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Ranga Reddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal', 'Yadadri Bhuvanagiri'],
  Tripura: ['Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 'Unakoti', 'West Tripura'],
  'Uttar Pradesh': ['Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kheri', 'Kushinagar', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Prayagraj', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'],
  Uttarakhand: ['Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar', 'Nainital', 'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar', 'Uttarkashi'],
  'West Bengal': ['Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda', 'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur', 'Purba Bardhaman', 'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur'],
  'Andaman and Nicobar Islands': ['Nicobar', 'North and Middle Andaman', 'South Andaman'],
  Chandigarh: ['Chandigarh'],
  'Dadra and Nagar Haveli and Daman and Diu': ['Dadra and Nagar Haveli', 'Daman', 'Diu'],
  Delhi: ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi', 'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'],
  'Jammu and Kashmir': ['Anantnag', 'Bandipora', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal', 'Jammu', 'Kathua', 'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch', 'Pulwama', 'Rajouri', 'Ramban', 'Reasi', 'Samba', 'Shopian', 'Srinagar', 'Udhampur'],
  Ladakh: ['Kargil', 'Leh'],
  Lakshadweep: ['Lakshadweep'],
  Puducherry: ['Karaikal', 'Mahe', 'Puducherry', 'Yanam'],
};
const FIELD_LABELS: Record<string, string> = {
  photoDataUrl: 'Photo',
  studentName: 'Name of Student',
  aadhaarNumber: 'Aadhaar Number',
  studentDateOfBirth: 'Date of Birth',
  fatherName: 'Name of Father',
  fatherJob: 'Job of Father',
  motherName: 'Name of Mother',
  motherJob: 'Job of Mother',
  state: 'State',
  district: 'District',
  panchayath: 'Panchayath',
  area: 'Area',
  mahalluName: 'Name of Mahallu',
  identificationMark1: 'Identification Mark 1',
  identificationMark2: 'Identification Mark 2',
  mobileNumber: 'Mobile Number',
  whatsappNumber: 'WhatsApp Number',
  email: 'Email',
  homeAddress: 'Home Address',
  residentialAddress: 'Residential Address',
  guardianName: 'Name of Guardian',
  guardianRelation: 'Relation with Student',
  guardianAddress: 'Address of Guardian',
  religiousPanchayathMunicipality: 'RC Religious Panchayath / Municipality / Corporation',
  schoolNameAndPlace: 'Name of School & Place',
  schoolClassCompleted: 'School Class Completed',
  madrassaNameAndPlace: 'Name of Madrassa & Place',
  madrassaClassCompleted: 'Madrassa Class Completed',
  admissionFor: 'Admission For',
  examCenterVenue: 'Chosen Entrance Exam Center & Venue',
  examDate: 'Date of Exam',
  guardianDeclarationAccepted: 'Declaration',
};
const MAX_PHOTO_SIZE_BYTES = 300 * 1024;

@Component({
  selector: 'app-admission-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="page">
      @if (currentStep() === 'entry') {
        <section class="panel entry-shell">
          <div class="section-head">
            <h1>Start Admission</h1>
            <p>Enter the applicant email and date of birth to continue or resume an existing application.</p>
          </div>

          <form [formGroup]="identityForm" (ngSubmit)="continueWithIdentity()" class="entry-form">
            <div class="field"><label>Email</label><input type="email" formControlName="email" /></div>
            <div class="field"><label>Date of Birth</label><input type="date" formControlName="studentDateOfBirth" /></div>
            @if (error()) {
              <p class="error-text field-full">{{ error() }}</p>
            }
            <div class="actions field-full">
              <button type="submit" [disabled]="loadingExisting()">Continue</button>
            </div>
          </form>
        </section>
      } @else {
        <section class="panel form-shell">
          <div class="section-head">
            <h1>Admission Form</h1>
            <p>Mannaniyya Unified Faculty of Integrated Education admission form for 2026-27.</p>
            @if (loadMessage()) {
              <p class="muted">{{ loadMessage() }}</p>
            }
          </div>

          <form [formGroup]="form" (ngSubmit)="submit()" class="form-grid">
            <div class="field field-full">
              <label>Upload Photo (Max: 300 KB)</label>
              <input type="file" accept="image/*" (change)="onPhotoSelected($event)" />
              @if (photoPreview()) {
                <img class="photo-preview" [src]="photoPreview()" alt="Student photo preview" />
              }
              @if (photoError()) {
                <p class="error-text">{{ photoError() }}</p>
              }
            </div>

            <div class="field"><label>Name of Student</label><input formControlName="studentName" /></div>
            <div class="field"><label>Date of Birth</label><input type="date" formControlName="studentDateOfBirth" /></div>
            <div class="field"><label>Aadhaar Number</label><input formControlName="aadhaarNumber" maxlength="12" /></div>
            <div class="field"><label>Email</label><input type="email" formControlName="email" /></div>
            <div class="field">
              <label>State</label>
              <input formControlName="state" list="india-states" autocomplete="off" (blur)="normalizeStateInput()" />
              <datalist id="india-states">
                @for (state of indiaStates; track state) {
                  <option [value]="state"></option>
                }
              </datalist>
            </div>
            <div class="field">
              <label>District</label>
              <input
                formControlName="district"
                [attr.list]="availableDistricts().length ? 'india-districts' : null"
                [disabled]="!availableDistricts().length"
                [placeholder]="availableDistricts().length ? 'Type or select district' : 'Select state first'"
                autocomplete="off"
                (blur)="normalizeDistrictInput()"
              />
              <datalist id="india-districts">
                @for (district of availableDistricts(); track district) {
                  <option [value]="district"></option>
                }
              </datalist>
            </div>
            <div class="field"><label>Panchayath</label><input formControlName="panchayath" /></div>
            <div class="field"><label>Area</label><input formControlName="area" /></div>
            <div class="field"><label>Name of Mahallu</label><input formControlName="mahalluName" /></div>
            <div class="field"><label>Identification Mark 1</label><input formControlName="identificationMark1" /></div>
            <div class="field"><label>Identification Mark 2</label><input formControlName="identificationMark2" /></div>

            <div class="field"><label>Name of Father</label><input formControlName="fatherName" /></div>
            <div class="field"><label>Job of Father</label><input formControlName="fatherJob" /></div>
            <div class="field"><label>Name of Mother</label><input formControlName="motherName" /></div>
            <div class="field"><label>Job of Mother</label><input formControlName="motherJob" /></div>
            <div class="field"><label>Mobile Number</label><input formControlName="mobileNumber" /></div>
            <div class="field"><label>WhatsApp Number</label><input formControlName="whatsappNumber" /></div>
            <div class="field field-full"><label>Home Address</label><textarea rows="3" formControlName="homeAddress"></textarea></div>
            <div class="field field-full"><label>Residential Address</label><textarea rows="3" formControlName="residentialAddress"></textarea></div>
            <div class="field"><label>Name of Guardian</label><input formControlName="guardianName" /></div>
            <div class="field"><label>Relation with Student</label><input formControlName="guardianRelation" /></div>
            <div class="field field-full"><label>Address of Guardian</label><textarea rows="3" formControlName="guardianAddress"></textarea></div>
            <div class="field field-full">
              <label>RC Religious Panchayath / Municipality / Corporation</label>
              <input formControlName="religiousPanchayathMunicipality" />
            </div>

            <div class="field field-full"><label>Name of School & Place (Last Studied)</label><input formControlName="schoolNameAndPlace" /></div>
            <div class="field"><label>School Class Completed</label><input formControlName="schoolClassCompleted" /></div>
            <div class="field field-full"><label>Name of Madrassa & Place (Last Studied)</label><input formControlName="madrassaNameAndPlace" /></div>
            <div class="field"><label>Madrassa Class Completed</label><input formControlName="madrassaClassCompleted" /></div>
            <div class="field">
              <label>Admission For</label>
              <select formControlName="admissionFor">
                @for (option of admissionOptions; track option) {
                  <option [value]="option">{{ option }}</option>
                }
              </select>
            </div>
            <div class="field field-full"><label>Chosen Entrance Exam Center & Venue</label><textarea rows="2" formControlName="examCenterVenue" readonly></textarea></div>
            <div class="field"><label>Date of Exam</label><input type="date" formControlName="examDate" readonly /></div>
            <div class="field field-full"><label>Remarks</label><textarea rows="2" formControlName="remarks"></textarea></div>

            <label class="pledge field-full">
              <input type="checkbox" formControlName="guardianDeclarationAccepted" />
              <span>I hereby declare that the above information is true.</span>
            </label>

            @if (error()) {
              <p class="error-text field-full">{{ error() }}</p>
            }

            <div class="actions field-full">
              <button type="button" class="ghost" (click)="backToIdentity()">Back</button>
              <button type="button" class="ghost" (click)="resetForm()">Clear All</button>
              <button type="submit" [disabled]="submitting()">Submit Application</button>
            </div>
          </form>
        </section>
      }
    </section>
  `,
  styles: [
    `
      .entry-shell,
      .form-shell {
        padding: clamp(1.2rem, 3vw, 2rem);
      }
      .entry-form {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
        margin-top: 1.25rem;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
        margin-top: 1.25rem;
      }
      .field-full {
        grid-column: 1 / -1;
      }
      .photo-preview {
        width: 120px;
        height: 150px;
        object-fit: cover;
        border-radius: 18px;
        border: 1px solid var(--line);
        box-shadow: var(--shadow-md);
      }
      .pledge {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        padding: 1rem 1.2rem;
        background: linear-gradient(135deg, rgba(223, 248, 227, 0.86), rgba(255, 255, 255, 0.92));
        border-radius: 18px;
        border: 1px solid var(--line);
        font-weight: 700;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.8rem;
      }
      .ghost {
        color: var(--primary);
        background: rgba(255, 255, 255, 0.82);
        border: 1px solid var(--line);
      }
      @media (max-width: 720px) {
        .entry-form,
        .form-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AdmissionPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AdmissionApiService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly admissionOptions = ADMISSION_OPTIONS;
  readonly indiaStates = INDIA_STATES;
  readonly currentStep = signal<'entry' | 'details'>('entry');
  readonly selectedState = signal('');
  readonly availableDistricts = computed(() => DISTRICTS_BY_STATE[this.selectedState()] ?? []);
  readonly loadingExisting = signal(false);
  readonly submitting = signal(false);
  readonly error = signal('');
  readonly loadMessage = signal('');
  readonly photoError = signal('');
  readonly photoPreview = signal('');

  readonly identityForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    studentDateOfBirth: ['', Validators.required],
  });

  readonly form = this.fb.nonNullable.group({
    photoDataUrl: ['', Validators.required],
    studentName: ['', Validators.required],
    aadhaarNumber: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
    studentDateOfBirth: ['', Validators.required],
    fatherName: ['', Validators.required],
    fatherJob: ['', Validators.required],
    motherName: ['', Validators.required],
    motherJob: ['', Validators.required],
    state: ['', Validators.required],
    district: ['', Validators.required],
    panchayath: ['', Validators.required],
    area: ['', Validators.required],
    mahalluName: ['', Validators.required],
    identificationMark1: ['', Validators.required],
    identificationMark2: ['', Validators.required],
    mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    whatsappNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    email: ['', [Validators.required, Validators.email]],
    homeAddress: ['', Validators.required],
    residentialAddress: ['', Validators.required],
    guardianName: ['', Validators.required],
    guardianRelation: ['', Validators.required],
    guardianAddress: ['', Validators.required],
    religiousPanchayathMunicipality: ['', Validators.required],
    schoolNameAndPlace: ['', Validators.required],
    schoolClassCompleted: ['', Validators.required],
    madrassaNameAndPlace: ['', Validators.required],
    madrassaClassCompleted: ['', Validators.required],
    admissionFor: ['Secondary (8-10)' as (typeof ADMISSION_OPTIONS)[number], Validators.required],
    examCenterVenue: [DEFAULT_EXAM_CENTER_VENUE, Validators.required],
    examDate: [DEFAULT_EXAM_DATE, Validators.required],
    remarks: [''],
    guardianDeclarationAccepted: [false, Validators.requiredTrue],
  });

  constructor() {
    this.restoreDraft();
    this.selectedState.set(this.form.controls.state.value);
    this.form.controls.state.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((state) => {
      this.selectedState.set(state);
      if (state && !this.availableDistricts().includes(this.form.controls.district.value)) {
        this.form.controls.district.setValue('', { emitEvent: false });
        this.persistDraft();
      }
      if (!state && this.form.controls.district.value) {
        this.form.controls.district.setValue('', { emitEvent: false });
        this.persistDraft();
      }
    });
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.persistDraft();
    });
  }

  async continueWithIdentity() {
    this.error.set('');
    this.loadMessage.set('');

    if (this.identityForm.invalid) {
      this.identityForm.markAllAsTouched();
      this.error.set('Enter a valid email and date of birth to continue.');
      return;
    }

    this.loadingExisting.set(true);
    try {
      const email = this.identityForm.controls.email.value.trim();
      const studentDateOfBirth = this.identityForm.controls.studentDateOfBirth.value;
      const lookup = await this.api.lookupAdmission(email, studentDateOfBirth);

      if (lookup.found && lookup.admission) {
        this.form.reset({
          photoDataUrl: lookup.admission.photoDataUrl,
          studentName: lookup.admission.studentName,
          aadhaarNumber: lookup.admission.aadhaarNumber,
          studentDateOfBirth: lookup.admission.studentDateOfBirth,
          fatherName: lookup.admission.fatherName,
          fatherJob: lookup.admission.fatherJob,
          motherName: lookup.admission.motherName,
          motherJob: lookup.admission.motherJob,
          state: lookup.admission.state,
          district: lookup.admission.district,
          panchayath: lookup.admission.panchayath,
          area: lookup.admission.area,
          mahalluName: lookup.admission.mahalluName,
          identificationMark1: lookup.admission.identificationMark1,
          identificationMark2: lookup.admission.identificationMark2,
          mobileNumber: lookup.admission.mobileNumber,
          whatsappNumber: lookup.admission.whatsappNumber,
          email: lookup.admission.email,
          homeAddress: lookup.admission.homeAddress,
          residentialAddress: lookup.admission.residentialAddress,
          guardianName: lookup.admission.guardianName,
          guardianRelation: lookup.admission.guardianRelation,
          guardianAddress: lookup.admission.guardianAddress,
          religiousPanchayathMunicipality: lookup.admission.religiousPanchayathMunicipality,
          schoolNameAndPlace: lookup.admission.schoolNameAndPlace,
          schoolClassCompleted: lookup.admission.schoolClassCompleted,
          madrassaNameAndPlace: lookup.admission.madrassaNameAndPlace,
          madrassaClassCompleted: lookup.admission.madrassaClassCompleted,
          admissionFor: lookup.admission.admissionFor as (typeof ADMISSION_OPTIONS)[number],
          examCenterVenue: lookup.admission.examCenterVenue,
          examDate: lookup.admission.examDate,
          remarks: lookup.admission.remarks || '',
          guardianDeclarationAccepted: lookup.admission.guardianDeclarationAccepted,
        });
        this.photoPreview.set(lookup.admission.photoDataUrl || '');
        this.loadMessage.set('Existing application loaded.');
      } else {
        this.form.reset({
          photoDataUrl: '',
          studentName: '',
          aadhaarNumber: '',
          studentDateOfBirth,
          fatherName: '',
          fatherJob: '',
          motherName: '',
          motherJob: '',
          state: '',
          district: '',
          panchayath: '',
          area: '',
          mahalluName: '',
          identificationMark1: '',
          identificationMark2: '',
          mobileNumber: '',
          whatsappNumber: '',
          email,
          homeAddress: '',
          residentialAddress: '',
          guardianName: '',
          guardianRelation: '',
          guardianAddress: '',
          religiousPanchayathMunicipality: '',
          schoolNameAndPlace: '',
          schoolClassCompleted: '',
          madrassaNameAndPlace: '',
          madrassaClassCompleted: '',
          admissionFor: 'Secondary (8-10)',
          examCenterVenue: DEFAULT_EXAM_CENTER_VENUE,
          examDate: DEFAULT_EXAM_DATE,
          remarks: '',
          guardianDeclarationAccepted: false,
        });
        this.photoPreview.set('');
        this.loadMessage.set('New application started.');
      }

      this.selectedState.set(this.form.controls.state.value);
      this.currentStep.set('details');
      this.persistDraft();
    } catch (err: any) {
      this.error.set(err?.error?.message || 'Unable to load admission details.');
    } finally {
      this.loadingExisting.set(false);
    }
  }

  async onPhotoSelected(event: Event) {
    this.photoError.set('');
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.form.controls.photoDataUrl.setValue('');
      this.photoPreview.set('');
      return;
    }

    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      input.value = '';
      this.form.controls.photoDataUrl.setValue('');
      this.photoPreview.set('');
      this.photoError.set('Photo size must be 300 KB or less.');
      return;
    }

    const dataUrl = await this.readFileAsDataUrl(file);
    this.form.controls.photoDataUrl.setValue(dataUrl);
    this.photoPreview.set(dataUrl);
  }

  async submit() {
    this.error.set('');
    this.loadMessage.set('');
    this.normalizeLocationInputs();
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const invalidFields = this.getInvalidFieldLabels();
      this.error.set(
        invalidFields.length
          ? `Please check these fields: ${invalidFields.join(', ')}.`
          : 'Please complete all required fields, upload the photo, and accept the declaration.',
      );
      return;
    }

    this.submitting.set(true);
    try {
      const result = await this.api.createAdmission(this.form.getRawValue());
      sessionStorage.setItem('mufied-admission-success', JSON.stringify(result));
      this.clearDraft();
      await this.router.navigate(['/admission/submitted']);
    } catch (err: any) {
      this.error.set(err?.error?.message || 'Unable to submit the application.');
    } finally {
      this.submitting.set(false);
    }
  }

  backToIdentity() {
    this.identityForm.patchValue({
      email: this.form.controls.email.value,
      studentDateOfBirth: this.form.controls.studentDateOfBirth.value,
    });
    this.error.set('');
    this.currentStep.set('entry');
  }

  resetForm() {
    this.identityForm.reset({
      email: '',
      studentDateOfBirth: '',
    });
    this.form.reset({
      photoDataUrl: '',
      studentName: '',
      aadhaarNumber: '',
      studentDateOfBirth: '',
      fatherName: '',
      fatherJob: '',
      motherName: '',
      motherJob: '',
      state: '',
      district: '',
      panchayath: '',
      area: '',
      mahalluName: '',
      identificationMark1: '',
      identificationMark2: '',
      mobileNumber: '',
      whatsappNumber: '',
      email: '',
      homeAddress: '',
      residentialAddress: '',
      guardianName: '',
      guardianRelation: '',
      guardianAddress: '',
      religiousPanchayathMunicipality: '',
      schoolNameAndPlace: '',
      schoolClassCompleted: '',
      madrassaNameAndPlace: '',
      madrassaClassCompleted: '',
      admissionFor: 'Secondary (8-10)',
      examCenterVenue: DEFAULT_EXAM_CENTER_VENUE,
      examDate: DEFAULT_EXAM_DATE,
      remarks: '',
      guardianDeclarationAccepted: false,
    });
    this.currentStep.set('entry');
    this.loadMessage.set('');
    this.photoPreview.set('');
    this.photoError.set('');
    this.clearDraft();
  }

  private readFileAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  protected normalizeStateInput() {
    const normalizedState = this.matchOption(this.form.controls.state.value, this.indiaStates);
    this.form.controls.state.setValue(normalizedState, { emitEvent: false });
    this.selectedState.set(normalizedState);
    if (!this.availableDistricts().includes(this.form.controls.district.value)) {
      this.form.controls.district.setValue('', { emitEvent: false });
    }
    this.persistDraft();
  }

  protected normalizeDistrictInput() {
    const normalizedDistrict = this.matchOption(this.form.controls.district.value, this.availableDistricts());
    this.form.controls.district.setValue(normalizedDistrict, { emitEvent: false });
    this.persistDraft();
  }

  private restoreDraft() {
    const rawDraft = this.readDraft();
    if (!rawDraft) {
      return;
    }

    try {
      const draft = JSON.parse(rawDraft) as Partial<ReturnType<typeof this.form.getRawValue>>;
      this.form.patchValue(draft, { emitEvent: false });
      this.identityForm.patchValue(
        {
          email: draft.email || '',
          studentDateOfBirth: draft.studentDateOfBirth || '',
        },
        { emitEvent: false },
      );
      this.selectedState.set(draft.state || '');
      if (draft.district && !this.availableDistricts().includes(draft.district)) {
        this.form.controls.district.setValue('', { emitEvent: false });
      }
      this.photoPreview.set(draft.photoDataUrl || '');
      if (draft.email && draft.studentDateOfBirth) {
        this.currentStep.set('details');
      }
    } catch {
      this.clearDraft();
    }
  }

  private persistDraft() {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(ADMISSION_DRAFT_STORAGE_KEY, JSON.stringify(this.form.getRawValue()));
  }

  private clearDraft() {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.removeItem(ADMISSION_DRAFT_STORAGE_KEY);
  }

  private readDraft() {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    return localStorage.getItem(ADMISSION_DRAFT_STORAGE_KEY);
  }

  private normalizeLocationInputs() {
    this.normalizeStateInput();
    this.normalizeDistrictInput();
    this.form.updateValueAndValidity({ emitEvent: false });
  }

  private matchOption(value: string, options: readonly string[]) {
    const normalizedValue = value.trim().toLowerCase();
    if (!normalizedValue) {
      return '';
    }

    return options.find((option) => option.trim().toLowerCase() === normalizedValue) || value.trim();
  }

  private getInvalidFieldLabels() {
    return Object.entries(this.form.controls)
      .filter(([, control]) => control.invalid)
      .map(([key]) => FIELD_LABELS[key] || key)
      .slice(0, 6);
  }
}
