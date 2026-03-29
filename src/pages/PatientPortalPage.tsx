import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarCheck, FileText, Pill, Activity, MessageSquare,
  CreditCard, Clock, Shield, ArrowRight, User, LogOut,
  Stethoscope, TestTube, Heart, Thermometer
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface Patient {
  id: string;
  patient_id: string;
  name: string;
  date_of_birth: string | null;
  gender: string | null;
  blood_type: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  insurance_provider: string | null;
  insurance_number: string | null;
  allergies: string[] | null;
  chronic_conditions: string[] | null;
  current_medications: string[] | null;
}

interface MedicalRecord {
  id: string;
  title: string;
  record_type: string;
  date: string | null;
  doctor_name: string | null;
  department: string | null;
  description: string | null;
  notes: string | null;
  results: any;
}

const PatientPortalPage: React.FC = () => {
  const { t, isRTL, language } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [patientIdInput, setPatientIdInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);

  const handleLogin = async () => {
    setLoginError('');
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('patient_id', patientIdInput.trim())
        .ilike('name', nameInput.trim())
        .single();

      if (error || !data) {
        setLoginError(language === 'ar' ? 'رقم المريض أو الاسم غير صحيح' : 'Invalid Patient ID or Name');
        setLoading(false);
        return;
      }

      setPatient(data as Patient);

      // Fetch medical records
      const { data: recordsData } = await supabase
        .from('medical_records')
        .select('*')
        .eq('patient_id', data.id)
        .order('date', { ascending: false });

      setRecords((recordsData || []) as MedicalRecord[]);
      setIsLoggedIn(true);
    } catch {
      setLoginError(language === 'ar' ? 'حدث خطأ، حاول مرة أخرى' : 'An error occurred, please try again');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPatient(null);
    setRecords([]);
    setPatientIdInput('');
    setNameInput('');
  };

  const appointments = records.filter(r => r.record_type === 'appointment');
  const labResults = records.filter(r => r.record_type === 'lab_result' || r.record_type === 'test');
  const prescriptions = records.filter(r => r.record_type === 'prescription');
  const visits = records.filter(r => r.record_type === 'visit' || r.record_type === 'consultation');

  if (!isLoggedIn) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
        <section className="page-hero">
          <div className="container mx-auto px-6 relative z-10 text-center">
            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-3">{t('portal.label')}</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4">{t('portal.title')}</motion.h1>
            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-white/60 max-w-2xl mx-auto">{t('portal.subtitle')}</motion.p>
          </div>
        </section>

        <section className="py-16 -mt-8 relative z-10">
          <div className="container mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="premium-card p-8 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2 text-center">
                {language === 'ar' ? 'تسجيل الدخول إلى بوابتك' : 'Login to Your Portal'}
              </h2>
              <p className="text-muted-foreground text-sm mb-6 text-center">
                {language === 'ar' ? 'أدخل رقم المريض واسمك للوصول إلى سجلاتك الطبية' : 'Enter your Patient ID and name to access your medical records'}
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'ar' ? 'رقم المريض' : 'Patient ID'}
                  </label>
                  <Input
                    placeholder={language === 'ar' ? 'مثال: PAT-001' : 'e.g., PAT-001'}
                    value={patientIdInput}
                    onChange={(e) => setPatientIdInput(e.target.value)}
                    className="rounded-[8px]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <Input
                    placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="rounded-[8px]"
                  />
                </div>
                {loginError && (
                  <p className="text-destructive text-sm text-center">{loginError}</p>
                )}
                <Button
                  onClick={handleLogin}
                  disabled={loading || !patientIdInput.trim() || !nameInput.trim()}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-[8px]"
                  size="lg"
                >
                  {loading
                    ? (language === 'ar' ? 'جاري التحقق...' : 'Verifying...')
                    : (language === 'ar' ? 'تسجيل الدخول' : 'Log In')}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.div>
    );
  }

  // Dashboard
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <section className="page-hero !py-10">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex items-center justify-between pt-14">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold text-white">
                {patient?.name?.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{language === 'ar' ? 'مرحباً،' : 'Welcome,'} {patient?.name}</h1>
                <p className="text-white/60 text-sm">{language === 'ar' ? 'رقم المريض:' : 'Patient ID:'} {patient?.patient_id}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="bg-destructive hover:bg-destructive/90 text-white border-none rounded-[8px]">
              <LogOut className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" dir={isRTL ? 'rtl' : 'ltr'}>
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full mb-8">
            <TabsTrigger value="overview">{language === 'ar' ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
            <TabsTrigger value="appointments">{language === 'ar' ? 'المواعيد' : 'Appointments'}</TabsTrigger>
            <TabsTrigger value="doctors">{language === 'ar' ? 'الأطباء' : 'Doctors'}</TabsTrigger>
            <TabsTrigger value="results">{language === 'ar' ? 'النتائج' : 'Results'}</TabsTrigger>
            <TabsTrigger value="medications">{language === 'ar' ? 'الأدوية' : 'Medications'}</TabsTrigger>
            <TabsTrigger value="profile">{language === 'ar' ? 'الملف الشخصي' : 'Profile'}</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { icon: CalendarCheck, label: language === 'ar' ? 'المواعيد القادمة' : 'Upcoming Appointments', value: appointments.length, color: 'text-primary' },
                { icon: TestTube, label: language === 'ar' ? 'نتائج الفحوصات' : 'Test Results', value: labResults.length, color: 'text-accent' },
                { icon: Pill, label: language === 'ar' ? 'الأدوية الحالية' : 'Current Medications', value: patient?.current_medications?.length || 0, color: 'text-secondary' },
                { icon: FileText, label: language === 'ar' ? 'إجمالي السجلات' : 'Total Records', value: records.length, color: 'text-muted-foreground' },
              ].map((stat, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: i * 0.1 }}
                  className="premium-card p-5">
                  <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-muted-foreground text-xs">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Patient Info Summary */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="premium-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-destructive" />
                  {language === 'ar' ? 'المعلومات الصحية' : 'Health Information'}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">{language === 'ar' ? 'فصيلة الدم' : 'Blood Type'}</span><span className="font-medium">{patient?.blood_type || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{language === 'ar' ? 'الحساسية' : 'Allergies'}</span><span className="font-medium">{patient?.allergies?.join(', ') || language === 'ar' ? 'لا يوجد' : 'None'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{language === 'ar' ? 'الأمراض المزمنة' : 'Chronic Conditions'}</span><span className="font-medium">{patient?.chronic_conditions?.join(', ') || language === 'ar' ? 'لا يوجد' : 'None'}</span></div>
                </div>
              </div>
              <div className="premium-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  {language === 'ar' ? 'التأمين' : 'Insurance'}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">{language === 'ar' ? 'شركة التأمين' : 'Provider'}</span><span className="font-medium">{patient?.insurance_provider || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{language === 'ar' ? 'رقم التأمين' : 'Policy Number'}</span><span className="font-medium">{patient?.insurance_number || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{language === 'ar' ? 'جهة اتصال الطوارئ' : 'Emergency Contact'}</span><span className="font-medium">{patient?.emergency_contact_name || '—'}</span></div>
                </div>
              </div>
            </div>

            {/* Recent Records */}
            {records.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold mb-4">{language === 'ar' ? 'أحدث السجلات' : 'Recent Records'}</h3>
                <div className="space-y-3">
                  {records.slice(0, 5).map(record => (
                    <div key={record.id} className="premium-card p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-accent" />
                        <div>
                          <p className="font-medium text-sm">{record.title}</p>
                          <p className="text-xs text-muted-foreground">{record.doctor_name} • {record.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs">{record.record_type}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{record.date ? new Date(record.date).toLocaleDateString() : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <h3 className="text-lg font-semibold mb-4">{language === 'ar' ? 'المواعيد' : 'Appointments'}</h3>
            {appointments.length > 0 ? appointments.map(apt => (
              <div key={apt.id} className="premium-card p-5 mb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{apt.title}</p>
                    <p className="text-sm text-muted-foreground">{apt.doctor_name} — {apt.department}</p>
                    <p className="text-sm text-muted-foreground">{apt.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{apt.date ? new Date(apt.date).toLocaleDateString() : ''}</p>
                    <Badge className="mt-1">{language === 'ar' ? 'مؤكد' : 'Confirmed'}</Badge>
                  </div>
                </div>
              </div>
            )) : <p className="text-muted-foreground text-center py-10">{language === 'ar' ? 'لا توجد مواعيد' : 'No appointments found'}</p>}
          </TabsContent>

          {/* Doctors Tab */}
          <TabsContent value="doctors">
            <h3 className="text-lg font-semibold mb-4">{language === 'ar' ? 'أطبائك' : 'Your Doctors'}</h3>
            {(() => {
              const doctors = [...new Set(records.filter(r => r.doctor_name).map(r => JSON.stringify({ name: r.doctor_name, dept: r.department })))].map(s => JSON.parse(s));
              return doctors.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {doctors.map((doc, i) => (
                    <div key={i} className="premium-card p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Stethoscope className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.dept}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-muted-foreground text-center py-10">{language === 'ar' ? 'لا يوجد أطباء مسجلون' : 'No doctors on record'}</p>;
            })()}
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results">
            <h3 className="text-lg font-semibold mb-4">{language === 'ar' ? 'نتائج الفحوصات' : 'Test Results'}</h3>
            {labResults.length > 0 ? labResults.map(result => (
              <div key={result.id} className="premium-card p-5 mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{result.title}</p>
                    <p className="text-sm text-muted-foreground">{result.doctor_name} — {result.department}</p>
                    {result.description && <p className="text-sm mt-2">{result.description}</p>}
                    {result.notes && <p className="text-xs text-muted-foreground mt-1 italic">{result.notes}</p>}
                  </div>
                  <p className="text-xs text-muted-foreground">{result.date ? new Date(result.date).toLocaleDateString() : ''}</p>
                </div>
              </div>
            )) : <p className="text-muted-foreground text-center py-10">{language === 'ar' ? 'لا توجد نتائج فحوصات' : 'No test results found'}</p>}
          </TabsContent>

          {/* Medications Tab */}
          <TabsContent value="medications">
            <h3 className="text-lg font-semibold mb-4">{language === 'ar' ? 'الأدوية الحالية' : 'Current Medications'}</h3>
            {patient?.current_medications && patient.current_medications.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {patient.current_medications.map((med, i) => (
                  <div key={i} className="premium-card p-4 flex items-center gap-3">
                    <Pill className="w-5 h-5 text-accent" />
                    <span className="font-medium text-sm">{med}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-muted-foreground text-center py-10">{language === 'ar' ? 'لا توجد أدوية مسجلة' : 'No medications on record'}</p>}

            {/* Prescriptions */}
            {prescriptions.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">{language === 'ar' ? 'الوصفات الطبية' : 'Prescriptions'}</h3>
                {prescriptions.map(rx => (
                  <div key={rx.id} className="premium-card p-5 mb-3">
                    <p className="font-semibold">{rx.title}</p>
                    <p className="text-sm text-muted-foreground">{rx.doctor_name} • {rx.date ? new Date(rx.date).toLocaleDateString() : ''}</p>
                    {rx.description && <p className="text-sm mt-1">{rx.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="premium-card p-8 max-w-2xl">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                {language === 'ar' ? 'الملف الشخصي' : 'Personal Profile'}
              </h3>
              <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                {[
                  [language === 'ar' ? 'الاسم' : 'Name', patient?.name],
                  [language === 'ar' ? 'رقم المريض' : 'Patient ID', patient?.patient_id],
                  [language === 'ar' ? 'تاريخ الميلاد' : 'Date of Birth', patient?.date_of_birth],
                  [language === 'ar' ? 'الجنس' : 'Gender', patient?.gender],
                  [language === 'ar' ? 'فصيلة الدم' : 'Blood Type', patient?.blood_type],
                  [language === 'ar' ? 'الهاتف' : 'Phone', patient?.phone],
                  [language === 'ar' ? 'البريد الإلكتروني' : 'Email', patient?.email],
                  [language === 'ar' ? 'العنوان' : 'Address', patient?.address],
                  [language === 'ar' ? 'شركة التأمين' : 'Insurance Provider', patient?.insurance_provider],
                  [language === 'ar' ? 'رقم التأمين' : 'Insurance Number', patient?.insurance_number],
                  [language === 'ar' ? 'جهة اتصال الطوارئ' : 'Emergency Contact', patient?.emergency_contact_name],
                  [language === 'ar' ? 'هاتف الطوارئ' : 'Emergency Phone', patient?.emergency_contact_phone],
                ].map(([label, value], i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-muted-foreground text-xs">{label}</span>
                    <span className="font-medium">{value || '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </motion.div>
  );
};

export default PatientPortalPage;
