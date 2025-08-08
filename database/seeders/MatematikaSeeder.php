<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MatematikaSeeder extends Seeder
{
    public function run()
    {
        // 1️⃣ Insert 'matematika' into subjects table
        $subjectId = DB::table('subjects')->insertGetId([
            'name' => 'matematika',
            'code' => '001',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2️⃣ Define the topics
        $topics = [
            "Sonlar. Natural. Butun. Ratsional. Irratsional.",
            "To'plamlar va ular ustida bajariladigan amallar. Venn diagrammasi",
            "Fikrlar ketma ketligi. Mantiqiy topshiriqlar.",
            "Hisoblashga oid misollar",
            "Bo'linish belgilari. Qoldiqli bo'lish",
            "Umumiy bo'luvchi va umumiy karrali. EKUB va EKUK. Oxirgi raqam, butun sonlar",
            "Oddiy kasrlar. Butun va kasr qismlil sonlar. O'nli kasrlar. Cheksiz davriy o'nli kasrlar",
            "Matnli masalalar. Harakatga, birgalikda bajarilgan ishga va aralashmalarga oid masalalarni yechish usullari",
            "Turli mazmundagi matnli masalalarni yechish usullari",
            "Miqdorning taqribiy qiymati, sonlarni yaxlitlash, absolut va nisbiy xatolik, sonning moduli va standart shakli",
            "Proporsiyaga doir masalalar",
            "Foizlar va foizga doir turli matnli masalalar",
            "Natural ko'rsatkichli darajaning arifmetik ildizi va uning xossalari. Ratsional ko'rsatkichli darajaga oid misollarni yechish",
            "Ketma-ketlik qonuniyatlari.",
            "Sonli ketma-ketliklar. Arifmetik progressiya va uning xossalari",
            "Geometrik progressiya va uning xossalari. Cheksiz kamayuvchi geometrik progressiya",
            "Ketma-ketlikdagi qonuniyatni topish, mantiq va algoritmga doir masalalarni yechish",
            "Chiziqli tenglamalar va tenglamalar sistemasi. Parametrli chiziqli tenglamalar. Parametrli chiziqli tenglamalar sistemasi",
            "Funksiya va tenglamalar. Chiziqli funksiya. Chiziqli tengsizliklar",
            "Kvadrat tenglama. Viet teoremasi. Parametr qatnashgan kvadrat tenglamalar. Ratsional tenglamalar.",
            "Kvadrat funksiya va uning xossalari. Kvadrat tengsizliklar",
            "Modul qatnashgan tenglama va tengsizliklar",
            "Ikkinchi va undan yuqori tartibli tenglamalar sistemasi",
            "Parametrli tengsizliklar. Tengsizliklarni isbotlash. Nostandart tenglama va tengsizliklarni yechish.",
            "Grafiklarni almashtirish. Teskari funksiya",
            "Ko'rsatkichli va logarifmik funksiyalar. Logarifmik ifodalarni shakl almashtirish",
            "Ko'rsatkichli tenglama va tengsizliklar",
            "Logarifmik tenglama va tengsizliklar",
            "Trigonometriya elementlari. Trigonometrik ayniyatlar",
            "Trigonometrik tenglamalar",
            "Trigonometrik funksiyalar va ularning xossalari. Teskari trigonometrik funksiyalar",
            "Trigonometrik tengsizliklar",
            "Matematika tahlili",
            "Ko'phadlarni tahlili",
            "Kombinatorika masalalari",
            "Nyuton binomi va Paskal uchburchagi",
            "Tasodifiy hodisalar va ularning ehtimolligi",
            "Ehtimolliklarni qo‘shish va ko‘paytirish. Hodisalarni ehtimolligini hisoblash usullari",
            "Burchaklar. Parallel to‘g‘ri chiziqlar. Uchburchak va uning elementlariga doir masalalar yechish",
            "Uchburchaklarning tenglik alomatlariga doir masalalar yechish",
            "To‘g‘ri burchakli uchburchak. Pifagor teoremasi",
            "Uchburchakning yuzi. Uchburchaklar o‘xshashligi",
            "Uchburchaklarni yechish",
            "To‘rtburchaklar: To‘g‘ri to‘rtburchak, kvadrat, parallelogramm va romb",
            "Trapeziya va uning xossalari. Ko‘pburchaklar",
            "Aylana va doira",
            "Uchburchak va aylana, to‘rtburchak va aylana, ko‘pburchak va aylana",
            "Hosila. Hosilani hisoblash qoidalari",
            "Hosilaning fizik va geometrik ma’nosi",
            "Hosila yordamida funksiyani tekshirish",
            "Boshlang‘ich funksiya va aniqmas integral",
            "Aniq integral. Nyuton-Leybnis formulasi. Egri chiziqli trapeziyaning yuzi",
            "Nostandart masalalarni yechish usullari",
            "Koordinatalar usuli",
            "Vektorlar va ular ustida amallar",
            "Fazoda to‘g‘ri chiziq va tekisliklarga doir masalalar yechish",
            "Ko‘pyoqlar: kub, parallelepiped, prizma va piramida",
            "Aylanish jismlari: silindr, konus, shar va sfera",
            "Fazoviy jismlarning kombinatsiyasiga doir masalalar yechish",
            "Yakunlovchi dars"
        ];

        // 3️⃣ Insert topics with the subject_id
        foreach ($topics as $index => $topic) {
            DB::table('topics')->insert([
                'subject_id' => $subjectId,
                'title' => $topic,
                'order' => $index + 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
