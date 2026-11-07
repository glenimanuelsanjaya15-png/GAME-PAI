/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Materi & Data Pedagogis Kurikulum Merdeka PAI Fase C (Kelas V & VI)
 * Disusun secara komprehensif oleh Tim Pengembang SDN 2 Girimarto Wonogiri
 */

import { GradeLevel, PedagogicalSessionData, RadarHotspot, PedagogicalQuestion } from '../types';

export interface LevelInfo {
  levelNumber: number;
  title: string;
  subtitle: string;
  chapterRefV: string;
  chapterRefVI: string;
  descriptionV: string;
  descriptionVI: string;
  cinematicDialog: { speaker: string; text: string }[];
}

export const LEVELS_CONFIG: LevelInfo[] = [
  {
    levelNumber: 1,
    title: 'RUMAHKU ASRI',
    subtitle: 'Pemilahan Sampah & Fondasi Amanah Khalifah di Rumah',
    chapterRefV: 'PAI Kelas V — Bab 3 & 4 (Khalifah fil Ardh & Menjaga Kebersihan)',
    chapterRefVI: 'PAI Kelas VI — Bab 4 (Dampak Sampah terhadap Ekosistem Biotik-Abiotik)',
    descriptionV: 'Kumpulkan dan pilah sampah di halaman rumah menjadi Organik, Anorganik, dan B3 Aman menggunakan capit pelindung. Belajarlah menjadi khalifah cilik yang amanah menjaga kebersihan sebagian dari iman.',
    descriptionVI: 'Analisis jenis limbah rumah tangga dan dampaknya terhadap komponen abiotik (tanah, air, udara) serta biotik (tumbuhan, hewan, mikroorganisme). Waspadai limbah B3 dan gunakan protokol keselamatan.',
    cinematicDialog: [
      { speaker: 'BUMI (Robot Pemandu Nusantara)', text: 'Assalamu’alaikum, Khalifah Penjaga Bumi! Selamat datang di petualangan sucimu.' },
      { speaker: 'BUMI', text: 'Allah menciptakan bumi ini indah dan seimbang. Manusia diberi amanah agung sebagai Khalifah fil Ardh.' },
      { speaker: 'BUMI', text: 'Misi pertamamu dimulai dari rumah: bersihkan halaman dan pilah sampah dengan bijak ke tong yang tepat!' }
    ]
  },
  {
    levelNumber: 2,
    title: 'SEKOLAHKU TANGGUNG JAWABKU',
    subtitle: 'Prinsip 3R (Reduce, Reuse, Recycle) & Hemat Energi Fasilitas Sekolah',
    chapterRefV: 'PAI Kelas V — Bab 3 (Tanggung Jawab Bersama di Lingkungan Sekolah)',
    chapterRefVI: 'PAI Kelas VI — Bab 8 (Aksi Nyata Pelestarian Lingkungan & Konservasi Sumber Daya)',
    descriptionV: 'Temukan huruf-huruf bercahaya penyusun prinsip 3R (REDUCE, REUSE, RECYCLE) di area sekolah, lalu matikan keran wudhu yang meluap dan lampu kelas yang menyala di siang hari.',
    descriptionVI: 'Terapkan konsep hemat sumber daya alam dan pencegahan pemborosan (tabdzir). Analisis sirkulasi air dan konsumsi energi di sekolah sebagai bentuk ibadah muamalah kontekstual.',
    cinematicDialog: [
      { speaker: 'BUMI', text: 'Alhamdulillah, rumahmu kini asri! Sekarang mari melangkah ke SDN 2 Girimarto.' },
      { speaker: 'BUMI', text: 'Di sekolah, ada huruf-huruf hikmah 3R yang tersembunyi dan fasilitas sekolah yang butuh perhatianmu.' },
      { speaker: 'BUMI', text: 'Ingat firman Allah: sesungguhnya orang-orang yang boros itu adalah saudara-saudara setan. Mari berhemat!' }
    ]
  },
  {
    levelNumber: 3,
    title: 'LABORATORIUM KHALIFAH',
    subtitle: 'Pusat Daur Ulang Futuristik & Mesin Capit Keputusan Ekologis',
    chapterRefV: 'PAI Kelas V — Bab 4 (Sikap Bijak Memanfaatkan Benda & Tidak Mubazir)',
    chapterRefVI: 'PAI Kelas VI — Bab 4 & 8 (Analisis Ilmiah Material Daur Ulang & Upcycling)',
    descriptionV: 'Kendalikan mesin capit mekanis di laboratorium pemilahan modern. Tentukan keputusan: Kurangi (Reduce), Pakai Kembali (Reuse), atau Daur Ulang (Recycle).',
    descriptionVI: 'Periksa kelayakan fisik benda! Pahami bahwa tidak semua benda plastik dapat didaur ulang dan limbah tercemar memerlukan dekomposisi atau komposting khusus.',
    cinematicDialog: [
      { speaker: 'BUMI', text: 'Selamat datang di Laboratorium Khalifah Nusantara!' },
      { speaker: 'BUMI', text: 'Di sini kita mengoperasikan Mesin Capit Ekologis untuk memilah material bernilai guna tinggi.' },
      { speaker: 'BUMI', text: 'Gunakan tombol kemudi untuk mengarahkan capit, jepit benda, dan lepaskan ke tabung yang tepat!' }
    ]
  },
  {
    levelNumber: 4,
    title: 'GUA KEBIJAKSANAAN',
    subtitle: 'Labirin Kristal, Keseimbangan Alam & Refleksi Tauhid Ekologis',
    chapterRefV: 'PAI Kelas V — Bab 9 (Meneladani Amanah & Menjaga Keseimbangan Ciptaan Allah)',
    chapterRefVI: 'PAI Kelas VI — Bab 8 (Hukum Keseimbangan Alam / Sunnatullah dalam Ekosistem)',
    descriptionV: 'Jelajahi gua kristal bercahaya dengan sungai bawah tanah yang jernih. Lewati 3 gerbang sandi dengan menjawab hikmah amanah khalifah tanpa tersesat.',
    descriptionVI: 'Pecahkan teka-teki hukum sebab-akibat ekologis (Sunnatullah). Pahami bagaimana satu gangguan pada faktor abiotik berdampak pada seluruh jejaring kehidupan.',
    cinematicDialog: [
      { speaker: 'BUMI', text: 'Subhanallah... Kita berada di dalam Gua Kebijaksanaan Nusantara!' },
      { speaker: 'BUMI', text: 'Kristal-kristal di sini memancarkan cahaya ilmu. Setiap gerbang terkunci oleh teka-teki amanah.' },
      { speaker: 'BUMI', text: 'Hati-hati melangkah di jembatan batu. Renungkan kebesaran Allah yang menjaga keseimbangan bumi.' }
    ]
  },
  {
    levelNumber: 5,
    title: 'PENJELAJAH CIPTAAN ALLAH',
    subtitle: 'Hutan Tropis, Keselamatan Satwa & Protokol Tanggap Bencana',
    chapterRefV: 'PAI Kelas V — Bab 3 (Rasa Syukur terhadap Kekayaan Hayati Ciptaan Allah)',
    chapterRefVI: 'PAI Kelas VI — Bab 7 & 10 (Analisis Kerusakan Hutan QS. Ar-Rum: 41 & Aksi Jagawana)',
    descriptionV: 'Susuri sungai dan hutan tropis nusantara. Selamatkan lingkungan dari sampah, tanam bibit pohon baru, dan jauhi bahaya api dengan aman.',
    descriptionVI: 'Analisis fenomena deforestasi, karhutla, dan fragmentasi habitat satwa. Praktikkan protokol keselamatan anak: jangan sentuh satwa liar, laporkan titik api ke jagawana!',
    cinematicDialog: [
      { speaker: 'BUMI', text: 'Hirup udara segar hutan tropis Nusantara! Inilah paru-paru dunia ciptaan Allah SWT.' },
      { speaker: 'BUMI', text: 'Namun waspadalah, ada jejak kerusakan: bara api yang tertinggal dan sampah di aliran sungai.' },
      { speaker: 'BUMI', text: 'Ingat protokol keselamatan: padamkan api dari jarak aman atau laporkan ke pos jagawana!' }
    ]
  },
  {
    levelNumber: 6,
    title: 'RADAR KHALIFAH NUSANTARA',
    subtitle: 'Ruang Kendali Investigasi Berita Resmi, Verifikasi & Tabayyun',
    chapterRefV: 'PAI Kelas V — Bab 4 (Sikap Jujur, Kritis, dan Tabayyun dalam Menerima Informasi)',
    chapterRefVI: 'PAI Kelas VI — Bab 10 (Literasi Digital, Analisis Komparatif Historis vs Fakta Terkini)',
    descriptionV: 'Analisis 6 titik kabar lingkungan di Nusantara termasuk Waduk Gajah Mungkur Wonogiri. Bedakan fakta nyata dengan kabar tidak terverifikasi.',
    descriptionVI: 'Lakukan verifikasi digital (Tabayyun - QS. Al-Hujurat: 6). Cek tanggal terbit, penerbit resmi, dan bedakan peristiwa masa lalu dengan kondisi keberhasilan pemulihan saat ini.',
    cinematicDialog: [
      { speaker: 'BUMI', text: 'Inilah Ruang Kendali Hologram Radar Nusantara!' },
      { speaker: 'BUMI', text: 'Peta Indonesia membentang di hadapanmu dengan 6 stasiun radar investigasi lingkungan.' },
      { speaker: 'BUMI', text: 'Sebagai khalifah cerdas, jangan menelan mentah-mentah berita lama! Lakukan Tabayyun dengan cermat.' }
    ]
  }
];

export const PEDAGOGICAL_DATA: Record<number, { v: PedagogicalSessionData; vi: PedagogicalSessionData }> = {
  1: {
    v: {
      level: 1,
      title: 'Penguatan Pedagogis Level 1: Rumahku Surgaku yang Bersih',
      summary: 'Rasulullah SAW bersabda: "Kebersihan itu sebagian dari iman." Menjaga kebersihan dan memilah sampah di rumah adalah wujud nyata pelaksanaan tugas khalifah fil ardh tingkat pertama.',
      quranVerse: {
        surah: 'QS. Al-Baqarah',
        verseNumber: '30',
        arabic: 'وَإِذْ قَالَ رَبُّكَ لِلْمَلَائِكَةِ إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً',
        translation: 'Ingatlah ketika Tuhanmu berfirman kepada para Malaikat: "Sesungguhnya Aku hendak menjadikan seorang khalifah di muka bumi."'
      },
      reflectionPrompt: 'Ketika kamu membuang sampah sembarangan di kamar atau halaman rumah, siapakah yang sesungguhnya dirugikan? Bagaimana perasaan orang tuamu jika rumah selalu rapi dan bersih?',
      questions: [
        {
          id: 'p1_v_1',
          question: 'Apakah makna utama manusia diciptakan Allah sebagai "Khalifah fil Ardh"?',
          options: [
            'Pemimpin yang berhak menghabiskan semua kekayaan alam sesuka hati',
            'Pemimpin dan pemelihara bumi dengan rasa amanah dan tanggung jawab',
            'Penguasa yang tidak perlu memikirkan masa depan bumi',
            'Penonton keindahan alam tanpa memiliki tugas apapun'
          ],
          correctIndex: 1,
          explanation: 'Khalifah bermakna wakil atau pemimpin yang dipercaya Allah untuk merawat, memakmurkan, dan menjaga bumi agar tidak rusak.'
        },
        {
          id: 'p1_v_2',
          question: 'Mengapa sampah B3 seperti baterai mainan bekas tidak boleh dicampur dengan sampah daun atau sisa makanan?',
          options: [
            'Karena baterai mengandung zat kimia beracun yang bisa meracuni tanah dan membahayakan petugas',
            'Hanya karena bentuk baterai lebih keras dari daun',
            'Agar tempat sampah daun terlihat lebih banyak dan penuh',
            'Karena baterai dapat meledak jika terkena air hujan biasa'
          ],
          correctIndex: 0,
          explanation: 'Sampah B3 (Bahan Berbahaya dan Beracun) seperti baterai mengandung logam berat (merkuri, timbal) yang dapat mencemari air tanah bila tidak ditangani khusus.'
        }
      ],
      actionRecommendation: 'Mulai hari ini di rumah: sediakan minimal dua kantong/tempat sampah terpisah di kamarmu (satu untuk kertas/plastik bersih, satu untuk sampah basah).'
    },
    vi: {
      level: 1,
      title: 'Penguatan Pedagogis Level 1: Analisis Ekologis Limbah Domestik',
      summary: 'Limbah rumah tangga secara langsung mempengaruhi keseimbangan antara komponen biotik (organisme tanah, cacing, tanaman) dan abiotik (pH tanah, kejernihan air tanah, kualitas udara). Sikap tabdzir (pemborosan) memicu penumpukan timbulan sampah.',
      quranVerse: {
        surah: 'QS. Al-Isra',
        verseNumber: '26-27',
        arabic: 'وَلَا تُبَذِّرْ تَبْذِيرًا • إِنَّ الْمُبَذِّرِينَ كَانُوا إِخْوَانَ الشَّيَاطِينِ',
        translation: 'Dan janganlah kamu menghambur-hamburkan (hartamu) secara boros. Sesungguhnya para pemboros itu adalah saudara-saudara setan.'
      },
      reflectionPrompt: 'Berapa banyak kantong plastik dan kemasan sachet yang kamu gunakan dalam 24 jam terakhir? Bagaimana pengaruh plastik tersebut terhadap siklus dekomposisi tanah selama 100 tahun ke depan?',
      questions: [
        {
          id: 'p1_vi_1',
          question: 'Manakah di bawah ini yang merupakan dampak negatif pencampuran sampah anorganik plastik ke dalam tanah terhadap komponen biotik?',
          options: [
            'Meningkatkan kesuburan cacing tanah dan bakteri pengurai',
            'Menghalangi penetrasi oksigen dan air sehingga membunuh mikroorganisme tanah yang menyuburkan tanaman',
            'Membuat tanah menjadi lebih cepat gembur dan kaya humus',
            'Menghasilkan gas nitrogen murni yang mempercepat fotosintesis'
          ],
          correctIndex: 1,
          explanation: 'Lapisan plastik tidak dapat terurai secara biologis dan menjadi barier mekanis yang mematikan cacing serta mikroba tanah pengurai humus.'
        },
        {
          id: 'p1_vi_2',
          question: 'Dalam hierarki pengelolaan sampah modern Kurikulum Merdeka PAI, manakah tindakan yang paling utama dilakukan sebelum memikirkan daur ulang (recycle)?',
          options: [
            'Membakar sampah di pekarangan rumah',
            'Membuang sampah ke sungai di malam hari',
            'Mencegah timbulan sampah sejak awal melalui pengurangan (Reduce)',
            'Mengubur semua jenis plastik di dekat sumur air'
          ],
          correctIndex: 2,
          explanation: 'Reduce (mengurangi sampah dari sumbernya, misalnya membawa botol minum sendiri) adalah langkah pencegahan utama (preventif) sebelum penanganan daur ulang.'
        }
      ],
      actionRecommendation: 'Buatlah audit sampah keluarga selama 3 hari: catat berat atau jenis sampah harian yang dihasilkan di rumahmu, diskusikan cara mengurangi kemasan sekali pakai bersama keluarga.'
    }
  },
  2: {
    v: {
      level: 2,
      title: 'Penguatan Pedagogis Level 2: Adab Khalifah di Lingkungan Sekolah',
      summary: 'Sekolah adalah rumah kedua bagi penuntut ilmu. Mematikan keran tempat wudhu yang mengalir sia-sia dan menghemat listrik kelas adalah bagian dari ibadah dan amanah seorang murid beriman.',
      quranVerse: {
        surah: 'QS. Al-A\'raf',
        verseNumber: '31',
        arabic: 'يَا بَنِي آدَمَ خُذُوا زِينَتَكُمْ عِندَ كُلِّ مَسْجِدٍ وَكُلُوا وَاشْرَبُوا وَلَا تُسْرِفُوا ۚ إِنَّهُ لَا يُحِبُّ الْمُسْرِفِينَ',
        translation: 'Makan dan minumlah, tetapi jangan berlebih-lebihan. Sesungguhnya Allah tidak menyukai orang-orang yang berlebih-lebihan.'
      },
      reflectionPrompt: 'Ketika kamu berwudhu, apakah kamu membuka keran air sebesar-besarnya? Tahukah kamu bahwa Rasulullah SAW berwudhu hanya dengan satu mud air (sekitar 0,6 liter)?',
      questions: [
        {
          id: 'p2_v_1',
          question: 'Bagaimana tuntunan Rasulullah SAW ketika menggunakan air untuk berwudhu di sungai yang mengalir deras sekalipun?',
          options: [
            'Boleh menghabiskan air sebanyak mungkin karena sungai tidak akan habis',
            'Dilarang berlebih-lebihan dan tetap harus hemat air',
            'Harus membendung air sungai tersebut terlebih dahulu',
            'Hanya boleh berwudhu jika airnya berwarna keruh'
          ],
          correctIndex: 1,
          explanation: 'Rasulullah SAW melarang pemborosan air wudhu meskipun berada di tepi sungai yang mengalir deras, sebagai pendidikan adab hemat dan bersyukur atas nikmat air.'
        },
        {
          id: 'p2_v_2',
          question: 'Di antara prinsip 3R berikut, manakah contoh penerapan "REUSE" yang tepat di sekolah?',
          options: [
            'Menolak memakai tas belanja dan meminta plastik baru',
            'Menggunakan kembali sisi kosong kertas bekas untuk coretan hitungan matematika',
            'Membeli pulpen baru setiap kali tinta berkurang sedikit',
            'Menyalakan lampu kelas di siang hari saat matahari terik'
          ],
          correctIndex: 1,
          explanation: 'Reuse berarti menggunakan kembali barang yang masih layak tanpa proses pengolahan pabrik, seperti memanfaatkan bagian kosong kertas bekas.'
        }
      ],
      actionRecommendation: 'Jadilah "Duta Hemat Energi" di kelasmu: pastikan lampu dan kipas angin dimatikan saat jam istirahat atau jam pelajaran olahraga di luar kelas.'
    },
    vi: {
      level: 2,
      title: 'Penguatan Pedagogis Level 2: Manajemen Sumber Daya Sekolah & Efisiensi Energi',
      summary: 'Setiap tetes air dan kilowatt energi listrik di sekolah memerlukan sumber daya alam yang besar (PLTA, PLTU batu bara). Pengabaian pemborosan di sekolah melanggar prinsip keadilan sosial dan tanggung jawab ekologis generasi masa depan.',
      quranVerse: {
        surah: 'QS. Al-Qashash',
        verseNumber: '77',
        arabic: 'وَابْتَغِ فِيمَا آتَاكَ اللَّهُ الدَّارَ الْآخِرَةَ ۖ وَلَا تَنسَ نَصِيبَكَ مِنَ الدُّنْيَا ۖ وَأَحْسِن كَمَا أَحْسَنَ اللَّهُ إِلَيْكَ ۖ وَلَا تَبْغِ الْفَسَادَ فِي الْأَرْضِ',
        translation: 'Dan berbuat baiklah (kepada orang lain) sebagaimana Allah telah berbuat baik kepadamu, dan janganlah kamu berbuat kerusakan di muka bumi.'
      },
      reflectionPrompt: 'Mengapa fasilitas sekolah yang dirawat bersama bisa bertahan puluhan tahun, sedangkan fasilitas yang diabaikan cepat rusak? Apa kaitan konsep "Amanah" dengan inventaris publik?',
      questions: [
        {
          id: 'p2_vi_1',
          question: 'Secara ilmiah dan teologis, mengapa tindakan membiarkan keran air wudhu mengucur bocor berjam-jam merupakan bentuk pelanggaran amanah?',
          options: [
            'Karena menurunkan cadangan air tanah abiotik yang semestinya dinikmati generasi mendatang dan melanggar larangan tabdzir',
            'Karena air yang mengalir bisa berubah menjadi gas beracun secara spontan',
            'Hanya karena suara gemericik air mengganggu guru mengajar',
            'Karena air yang mengalir akan mengurangi berat bumi secara drastis'
          ],
          correctIndex: 0,
          explanation: 'Air tanah adalah komponen abiotik vital yang laju pengisian ulangnya lambat. Memboroskan air tanah mengancam keberlanjutan ekosistem dan melanggar amanah pemeliharaan.'
        },
        {
          id: 'p2_vi_2',
          question: 'Dalam menyusun strategi 3R di sekolah, apa perbedaan mendasar antara REDUCE dan RECYCLE?',
          options: [
            'Reduce adalah mendaur ulang di pabrik, sedangkan Recycle adalah mengurangi konsumsi',
            'Reduce mencegah terciptanya limbah sejak awal, sedangkan Recycle memproses limbah menjadi produk baru melalui energi tambahan',
            'Keduanya memiliki arti yang persis sama tanpa perbedaan teknis',
            'Recycle selalu lebih hemat energi daripada Reduce'
          ],
          correctIndex: 1,
          explanation: 'Reduce berfokus pada pencegahan dari hulu (hemat energi, tanpa limbah), sedangkan Recycle membutuhkan energi dan proses industri untuk mendaur ulang material.'
        }
      ],
      actionRecommendation: 'Buat program kotak pemilah kertas bekas di setiap sudut kelas untuk dijadikan bahan kerajinan tangan atau media belajar catatan.'
    }
  },
  3: {
    v: {
      level: 3,
      title: 'Penguatan Pedagogis Level 3: Menghargai Benda Ciptaan Allah',
      summary: 'Bahan-bahan di sekitar kita—kaca dari silika pasir, kertas dari serat pohon, plastik dari minyak bumi—adalah karunia Allah. Menghargai benda berarti memaksimalkan kegunaannya dan tidak mudah membuang barang yang masih bernilai.',
      quranVerse: {
        surah: 'QS. Al-An\'am',
        verseNumber: '141',
        arabic: 'كُلُوا مِن ثَمَرِهِ إِذَا أَثْمَرَ وَآتُوا حَقَّهُ يَوْمَ حَصَادِهِ ۖ وَلَا تُسْرِفُوا ۚ إِنَّهُ لَا يُحِبُّ الْمُسْرِفِينَ',
        translation: 'Makanlah dari buahnya bila berbuah dan berikanlah haknya pada hari memetik hasilnya, dan janganlah berlebih-lebihan. Sesungguhnya Allah tidak menyukai orang-orang yang berlebih-lebihan.'
      },
      reflectionPrompt: 'Pernahkah kamu meminta membeli mainan baru padahal mainan lamamu masih berfungsi baik? Apa yang bisa kamu lakukan dengan barang lamamu agar bermanfaat bagi orang lain?',
      questions: [
        {
          id: 'p3_v_1',
          question: 'Jika kamu memiliki toples kaca selai yang sudah kosong dan bersih di rumah, keputusan manakah yang paling bijak menurut adab khalifah?',
          options: [
            'Langsung melemparkannya ke sungai agar hanyut',
            'Membersihkannya dan menggunakannya kembali (Reuse) untuk wadah bumbu atau alat tulis',
            'Memecahkannya di jalan raya karena sudah tidak ada isinya',
            'Membakarnya bersama sampah dedaunan'
          ],
          correctIndex: 1,
          explanation: 'Toples kaca adalah wadah yang sangat kuat dan higienis. Menggunakannya kembali (Reuse) memperpanjang usia pakai dan mencegah sampah baru.'
        },
        {
          id: 'p3_v_2',
          question: 'Mengapa kita dianjurkan untuk menolak kantong plastik sekali pakai saat berbelanja jajanan sedikit (prinsip Reduce)?',
          options: [
            'Karena kantong plastik butuh ratusan tahun untuk terurai dan mencemari bumi',
            'Karena kantong plastik terlalu berat untuk dibawa pulang',
            'Agar pedagang tidak perlu membeli plastik lagi selamanya',
            'Karena kantong plastik dilarang di semua buku pelajaran'
          ],
          correctIndex: 0,
          explanation: 'Plastik sekali pakai langsung menjadi sampah dalam hitungan menit padahal membutuhkan ratusan tahun untuk hancur, sehingga penolakan di awal (Reduce) adalah langkah paling efektif.'
        }
      ],
      actionRecommendation: 'Kumpulkan kaleng biskuit atau botol bekas yang kokoh, hiaslah bersama teman menjadi tempat pensil meja belajar bernuansa batik Wonogiri.'
    },
    vi: {
      level: 3,
      title: 'Penguatan Pedagogis Level 3: Sirkularitas Material & Analisis Daur Ulang Ilmiah',
      summary: 'Tidak semua material dapat didaur ulang secara ekonomis maupun ekologis. Beberapa jenis polimer plastik melepaskan zat toksik saat dipanaskan kembali. Pemahaman daur ulang membutuhkan kearifan sains dan integritas amanah.',
      quranVerse: {
        surah: 'QS. Al-Furqan',
        verseNumber: '2',
        arabic: 'وَخَلَقَ كُلَّ شَيْءٍ فَقَدَّرَهُ تَقْدِيرًا',
        translation: 'Dan Dia menciptakan segala sesuatu, lalu menetapkan ukuran-ukurannya dengan tepat.'
      },
      reflectionPrompt: 'Mengapa kardus yang terkena minyak goreng sisa atau cat kimia tidak boleh dimasukkan ke dalam mesin daur ulang bubur kertas (pulp)? Bagaimana prinsip "Thoyyib" (baik/suci) berlaku dalam proses daur ulang?',
      questions: [
        {
          id: 'p3_vi_1',
          question: 'Mengapa kardus atau kertas yang tercampur minyak dan zat kimia basah tidak dapat didaur ulang menjadi kertas bersih kembali?',
          options: [
            'Kandungan minyak mengikat serat selulosa sehingga tidak dapat larut dalam air pada proses pembuatan bubur kertas (pulping)',
            'Karena minyak membuat kertas berubah menjadi logam tembaga',
            'Hanya karena warnanya menjadi sedikit lebih gelap',
            'Karena bau minyak disukai oleh bakteri penghasil emas'
          ],
          correctIndex: 0,
          explanation: 'Minyak adalah kontaminan hidrofobik yang merusak ikatan serat selulosa kertas dalam proses pulping daur ulang, sehingga kertas berminyak harus dikomposkan atau dibersihkan terlebih dahulu.'
        },
        {
          id: 'p3_vi_2',
          question: 'Konsep ekonomi sirkular (Circular Economy) dalam perspektif fiqih lingkungan (Fiqh al-Bi’ah) bertujuan untuk:',
          options: [
            'Mengeksploitasi sumber daya tambang secepat mungkin sebelum habis',
            'Menjaga agar material tetap berputar dalam siklus manfaat selama mungkin tanpa menghasilkan limbah yang merusak bumi (Zero Waste)',
            'Memindahkan seluruh industri limbah ke negara-negara miskin',
            'Mengganti semua benda di dunia dengan bahan logam mulia'
          ],
          correctIndex: 1,
          explanation: 'Ekonomi sirkular sejalan dengan prinsip tidak membuat kerusakan di bumi (La dharara wa la dhirar), di mana setiap sumber daya dirawat dan diputar manfaatnya secara optimal.'
        }
      ],
      actionRecommendation: 'Lakukan identifikasi kode segitiga daur ulang (PETE 1, HDPE 2, PVC 3, LDPE 4, PP 5, PS 6, OTHER 7) pada botol-botol kemasan di rumahmu dan klasifikasikan kemudahan daur ulangnya.'
    }
  },
  4: {
    v: {
      level: 4,
      title: 'Penguatan Pedagogis Level 4: Menjaga Keseimbangan Sunnatullah',
      summary: 'Allah menciptakan alam semesta dalam keadaan seimbang (Mizan). Gua, stalaktit yang terbentuk tetes demi tetes selama ribuan tahun, dan sungai bawah tanah adalah tanda keagungan ciptaan-Nya yang tidak boleh dirusak.',
      quranVerse: {
        surah: 'QS. Ar-Rahman',
        verseNumber: '7-9',
        arabic: 'وَالسَّمَاءَ رَفَعَهَا وَوَضَعَ الْمِيزَانَ • أَلَّا تَطْغَوْا فِي الْمِيزَانِ • وَأَقِيمُوا الْوَزْنَ بِالْقِسْطِ وَلَا تُخْسِرُوا الْمِيزَانَ',
        translation: 'Dan Allah telah meninggikan langit dan Dia meletakkan neraca (keseimbangan). Supaya kamu jangan melampaui batas tentang neraca itu. Dan tegakkanlah timbangan itu dengan adil dan janganlah kamu mengurangi neraca itu.'
      },
      reflectionPrompt: 'Bayangkan jika air sungai bawah tanah yang jernih dicemari oleh sampah plastik dan limbah sabun dari atas tanah. Siapakah makhluk hidup yang akan kehausan dan menderita?',
      questions: [
        {
          id: 'p4_v_1',
          question: 'Apa arti firman Allah dalam QS. Ar-Rahman: "Supaya kamu jangan melampaui batas tentang neraca (keseimbangan) itu"?',
          options: [
            'Manusia dilarang merusak tatanan keseimbangan alam yang telah Allah ciptakan secara sempurna',
            'Manusia diwajibkan membeli timbangan emas di pasar',
            'Manusia hanya boleh menimbang buah-buahan manis',
            'Manusia bebas merusak hutan asalkan membangun gedung tinggi'
          ],
          correctIndex: 0,
          explanation: 'Keseimbangan (Al-Mizan) mencakup seluruh ekosistem ciptaan Allah. Menjaga keseimbangan berarti tidak berbuat tamak dan tidak merusak alam.'
        },
        {
          id: 'p4_v_2',
          question: 'Bagaimana adab seorang muslim ketika berkunjung ke tempat wisata alam seperti gua, air terjun, atau pantai?',
          options: [
            'Mencoret-coret dinding batu gua dengan cat semprot sebagai kenang-kenangan',
            'Mengambil batu karang atau stalaktit untuk dibawa pulang ke rumah',
            'Menjaga kebersihan, tidak merusak ornamen alam, dan bertasbih mengagumi ciptaan Allah',
            'Menyalakan api unggun besar di dekat sarang kelelawar'
          ],
          correctIndex: 2,
          explanation: 'Adab penjelajah muslim adalah mentadaburi alam dengan bertasbih, tidak meninggalkan apapun selain jejak kaki, dan tidak mengambil apapun selain foto/pelajaran.'
        }
      ],
      actionRecommendation: 'Hafalkan dan amalkan doa ketika takjub melihat keindahan alam ciptaan Allah: "Rabbana ma khalaqta hadza bathila, Subhanaka faqina \'adzaban nar" (Wahai Tuhan kami, tiadalah Engkau menciptakan semua ini sia-sia, Maha Suci Engkau, peliharalah kami dari siksa neraka).'
    },
    vi: {
      level: 4,
      title: 'Penguatan Pedagogis Level 4: Karst, Hidrologi Karst & Kerentanan Akuifer',
      summary: 'Kawasan bentang alam karst (seperti di Pegunungan Sewu Jawa Tengah / Wonogiri selatan) memiliki sistem lorong gua dan sungai bawah tanah yang sangat rapuh. Air hujan langsung terserap ke dalam rekahan batugamping tanpa penyaringan tebal, sehingga limbah permukaan langsung mencemari akuifer air bersih ribuan warga.',
      quranVerse: {
        surah: 'QS. Al-Hijr',
        verseNumber: '19',
        arabic: 'وَالْأَرْضَ مَدَدْنَاهَا وَأَلْقَيْنَا فِيهَا رَوَاسِيَ وَأَنبَتْنَا فِيهَا مِن كُلِّ شَيْءٍ مَّوْزُونٍ',
        translation: 'Dan Kami telah menghamparkan bumi dan menjadikan padanya gunung-gunung dan Kami tumbuhkan padanya segala sesuatu menurut ukuran.'
      },
      reflectionPrompt: 'Bagaimana topografi karst di Jawa Bagian Selatan (termasuk Wonogiri) menyediakan air bersih bagi masyarakat? Mengapa membuang sampah ke dalam luweng (lubang gua vertikal) adalah kejahatan ekologis berbahaya?',
      questions: [
        {
          id: 'p4_vi_1',
          question: 'Mengapa membuang sampah domestik atau bangkai hewan ke dalam "luweng" (gua vertikal pada pegunungan karst) sangat berbahaya bagi ekosistem abiotik?',
          options: [
            'Karena luweng terhubung langsung dengan saluran sungai bawah tanah yang menjadi sumber air minum masyarakat tanpa proses filtrasi alami lapisan tanah tebal',
            'Karena luweng akan menyemburkan lava panas jika terkena sampah',
            'Hanya karena bau tidak sedap tidak bisa keluar dari dalam gua',
            'Karena membuat batu gamping berubah menjadi emas murni'
          ],
          correctIndex: 0,
          explanation: 'Sistem hidrologi karst memiliki konduktivitas tinggi dengan saluran conduit terbuka. Polutan yang masuk ke luweng akan langsung mengalir mencemari mata air dan sumur warga di hilir.'
        },
        {
          id: 'p4_vi_2',
          question: 'Keseimbangan ekologis dalam gua (seperti koloni kelelawar pemakan serangga dan pengurai guano) membuktikan bahwa:',
          options: [
            'Setiap komponen biotik diciptakan Allah memiliki peran penting (relung ekologis) yang saling menopang',
            'Kelelawar sengaja diciptakan untuk dimusnahkan manusia',
            'Gua tidak memerlukan campur tangan hukum alam',
            'Komponen abiotik air tidak berpengaruh pada makhluk hidup di dalam gua'
          ],
          correctIndex: 0,
          explanation: 'Kelelawar memakan hama serangga tanaman pertanian dan kotorannya (guano) menjadi nutrisi bagi organisme troglobiont gua. Kerusakan habitat kelelawar memicu ledakan hama di lahan pertanian.'
        }
      ],
      actionRecommendation: 'Buatlah infografis mini tentang siklus air tanah di daerah karst dan bagikan kepada teman sekelas untuk mengingatkan bahaya membuang sampah di luweng.'
    }
  },
  5: {
    v: {
      level: 5,
      title: 'Penguatan Pedagogis Level 5: Syukur & Perlindungan Makhluk Hidup',
      summary: 'Hutan nusantara adalah amanah agung dari Allah SWT. Di dalamnya terdapat satwa, tanaman obat, dan pepohonan penahan banjir. Jika kita melihat tanda kerusakan atau bahaya, kita harus bersikap bijak dan melapor kepada orang dewasa.',
      quranVerse: {
        surah: 'QS. Al-A\'raf',
        verseNumber: '56',
        arabic: 'وَلَا تُفْسِدُوا فِي الْأَرْضِ بَعْدَ إِصْلَاحِهَا وَادْعُوهُ خَوْفًا وَطَمَعًا ۚ إِنَّ رَحْمَتَ اللَّهِ قَرِيبٌ مِّنَ الْمُحْسِنِينَ',
        translation: 'Dan janganlah kamu berbuat kerusakan di bumi setelah (diciptakan) dengan baik. Dan berdoalah kepada-Nya dengan rasa takut dan penuh harap. Sesungguhnya rahmat Allah sangat dekat kepada orang-orang yang berbuat kebaikan.'
      },
      reflectionPrompt: 'Jika kamu melihat api unggun yang belum padam sempurna atau sampah botol menumpuk di tepi sungai hutan saat berkemah, apa tindakan terbaik yang aman untukmu lakukan?',
      questions: [
        {
          id: 'p5_v_1',
          question: 'Bagaimana sikap teladan seorang anak beriman jika menemukan bibit pohon yang bisa ditanam di area gundul?',
          options: [
            'Mencabut dan menginjak bibit tersebut agar tidak tumbuh',
            'Menanam dan menyiramnya dengan niat sedekah jariyah bagi bumi dan makhluk hidup',
            'Menjual bibit tersebut untuk membeli jajanan yang tidak sehat',
            'Membiarkannya layu kepanasan tanpa peduli'
          ],
          correctIndex: 1,
          explanation: 'Rasulullah SAW bersabda: Tidaklah seorang muslim menanam pohon atau menabur benih, lalu dimakan oleh burung, manusia, atau hewan, melainkan hal itu menjadi sedekah baginya.'
        },
        {
          id: 'p5_v_2',
          question: 'Saat berada di alam liar dan melihat satwa liar atau tanda bahaya kebakaran hutan, protokol keselamatan anak yang paling tepat adalah:',
          options: [
            'Mendekati api sendirian dan meniupnya sampai padam',
            'Menangkap satwa liar dengan tangan kosong untuk dijadikan mainan',
            'Menjauh dari sumber bahaya ekstrem, tidak mengganggu satwa, dan segera melapor kepada petugas pos/orang dewasa',
            'Menyiramkan bensin ke arah titik api'
          ],
          correctIndex: 2,
          explanation: 'Keselamatan jiwa (Hifz an-Nafs) adalah prioritas tertinggi dalam Islam. Anak-anak harus menjauhi bahaya dan meminta bantuan petugas jagawana terlatih.'
        }
      ],
      actionRecommendation: 'Tanam satu pohon pelindung atau tanaman buah di halaman rumah atau pot sekolah, rawatlah hingga tumbuh besar sebagai sedekah oksigen harianmu.'
    },
    vi: {
      level: 5,
      title: 'Penguatan Pedagogis Level 5: Kerusakan Lingkungan Akibat Tangan Manusia',
      summary: 'Kerusakan di darat dan di laut (Fasad fil Ardh) seperti kebakaran hutan, illegal logging, dan pencemaran sungai bukan sekadar bencana alam acak, melainkan akibat dari keserakahan dan kelalaian manusia sebagaimana diperingatkan dalam Al-Qur\'an.',
      quranVerse: {
        surah: 'QS. Ar-Rum',
        verseNumber: '41',
        arabic: 'ظَهَرَ الْفَسَادُ فِي الْبَرِّ وَالْبَحْرِ بِمَا كَسَبَتْ أَيْدِي النَّاسِ لِيُذِيقَهُم بَعْضَ الَّذِي عَمِلُوا لَعَلَّهُمْ يَرْجِعُونَ',
        translation: 'Telah tampak kerusakan di darat dan di laut disebabkan karena perbuatan tangan manusia; Allah menghendaki agar mereka merasakan sebagian dari (akibat) perbuatan mereka, agar mereka kembali (ke jalan yang benar).'
      },
      reflectionPrompt: 'Mengapa Allah menyebutkan bahwa kerusakan terjadi "akibat perbuatan tangan manusia"? Apa tujuan Allah menimpakan sebagian dampak buruk kerusakan itu kepada kita?',
      questions: [
        {
          id: 'p5_vi_1',
          question: 'Dalam tafsir QS. Ar-Rum ayat 41, kalimat "li-yudziqohum ba\'dhol-ladzi \'amilu" bermakna bahwa bencana lingkungan ditimpakan agar:',
          options: [
            'Manusia putus asa dan tidak mau berbuat kebaikan lagi',
            'Manusia sadar, merasakan akibat dari kelalaiannya, lalu bertaubat dan kembali memperbaiki bumi (koreksi diri)',
            'Semua manusia binasa seketika tanpa ampunan',
            'Hewan-hewan di hutan mengambil alih perkotaan'
          ],
          correctIndex: 1,
          explanation: 'Peringatan dalam Al-Qur\'an bertujuan pedagogis: agar manusia sadar akan dampak dosanya terhadap lingkungan hidup dan kembali menjalankan amanah perbaikan.'
        },
        {
          id: 'p5_vi_2',
          question: 'Ketika hutan tropis ditebang secara liar, manakah dampak berantai yang terjadi pada siklus abiotik dan biotik setempat?',
          options: [
            'Erosi tanah meningkat, debit mata air berkurang saat kemarau, dan satwa endemik kehilangan habitat sehingga turun ke pemukiman',
            'Jumlah air tanah bertambah banyak dan tidak ada lagi banjir',
            'Kandungan oksigen bumi meningkat dua kali lipat',
            'Suhu udara bumi menjadi jauh lebih dingin dan sejuk'
          ],
          correctIndex: 0,
          explanation: 'Akar pohon berfungsi mengikat butir tanah dan meresapkan air (infiltrasi). Hilangnya kanopi dan perakaran memicu erosi, longsor, kekeringan, dan konflik satwa-manusia.'
        }
      ],
      actionRecommendation: 'Buat kampanye anti perburuan satwa liar dilindungi dan ajak komunitas sekolah untuk mendukung konservasi hutan lindung.'
    }
  },
  6: {
    v: {
      level: 6,
      title: 'Penguatan Pedagogis Level 6: Cerdas Informasi & Tabayyun Kebangsaan',
      summary: 'Sebagai generasi muslim penerus bangsa, kita harus bersikap kritis dan cerdas menerima kabar berita tentang kondisi tanah air kita. Tabayyun (meneliti kebenaran berita) menghindarkan kita dari menyebarkan ketakutan atau berita bohong (hoaks).',
      quranVerse: {
        surah: 'QS. Al-Hujurat',
        verseNumber: '6',
        arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِن جَاءَكُمْ فَاسِقٌ بِنَبَإٍ فَتَبَيَّنُوا أَن تُصِيبُوا قَوْمًا بِجَهَالَةٍ فَتُصْبِحُوا عَلَىٰ مَا فَعَلْتُمْ نَادِمِينَ',
        translation: 'Wahai orang-orang yang beriman! Jika seseorang yang fasik datang kepadamu membawa suatu berita, maka telitilah kebenarannya (ber-tabayyun-lah), agar kamu tidak mencelakakan suatu kaum karena kebodohan (kecerobohan), yang akhirnya kamu menyesali perbuatanmu itu.'
      },
      reflectionPrompt: 'Jika kamu membaca judul berita di internet yang menakut-nakuti tentang air waduk di daerahmu yang kering padahal berita itu terbit 5 tahun yang lalu, apakah kamu langsung menyebarkannya ke grup WhatsApp keluarga?',
      questions: [
        {
          id: 'p6_v_1',
          question: 'Apa langkah pertama yang harus dilakukan oleh seorang muslim jika menerima kabar mengejutkan di internet tentang bencana alam?',
          options: [
            'Langsung meneruskan (forward) pesan itu ke semua grup tanpa membaca isinya',
            'Melakukan tabayyun: mengecek sumber resmi pemerintah/berita terpercaya dan memastikan tanggal beritanya baru',
            'Menambahkan cerita yang lebih heboh agar dibaca banyak orang',
            'Membuat status marah-marah di media sosial'
          ],
          correctIndex: 1,
          explanation: 'Tabayyun adalah kewajiban syar\'i dalam Islam untuk menyaring informasi, memverifikasi tanggal, lokasi, dan kredibilitas sumber sebelum mempercayai atau membagikannya.'
        },
        {
          id: 'p6_v_2',
          question: 'Di Kabupaten Wonogiri terdapat Waduk Gajah Mungkur yang sangat penting. Mengapa kita wajib menjaga Daerah Aliran Sungai (DAS) Keduang di hulu waduk?',
          options: [
            'Karena jika hulu DAS Keduang gundul, lumpur sedimentasi akan memenuhi waduk dan mengurangi pasokan air bagi jutaan petani',
            'Agar ikan di waduk bisa melompat ke atas pohon jati',
            'Hanya agar pemandangan di foto tampak hijau',
            'Karena air waduk dilarang digunakan untuk irigasi sawah'
          ],
          correctIndex: 0,
          explanation: 'DAS Keduang menyumbang sedimentasi lumpur terbesar ke Waduk Gajah Mungkur. Penghijauan hulu di Wonogiri menjamin kelangsungan waduk untuk PLTA dan irigasi jutaan hektar sawah.'
        }
      ],
      actionRecommendation: 'Jadilah penangkal hoaks di lingkungan keluarga: selalu ingatkan orang tua atau teman untuk melihat tanggal terbit dan penerbit resmi saat membaca berita heboh.'
    },
    vi: {
      level: 6,
      title: 'Penguatan Pedagogis Level 6: Verifikasi Kritis Data Ekologis & Literasi Sains Berkelanjutan',
      summary: 'Data ekologis bersifat dinamis. Permasalahan lingkungan historis (seperti banjir rob Demak masa lampau atau pencemaran Citarum sebelum 2018) sering kali telah mengalami transformasi lewat program restorasi intensif (seperti Citarum Harum dan penanaman mangrove). Menyimpulkan kondisi sekarang semata dari berita lama tanpa cross-check mutakhir adalah sesat pikir dan melanggar prinsip tabayyun ilmiah.',
      quranVerse: {
        surah: 'QS. Al-Isra',
        verseNumber: '36',
        arabic: 'وَلَا تَقْفُ مَا لَيْسَ لَكَ بِهِ عِلْمٌ ۚ إِنَّ السَّمْعَ وَالْبَصَرَ وَالْفُؤَادَ كُلُّ أُولَٰئِكَ كَانَ عَنْهُ مَسْئُولًا',
        translation: 'Dan janganlah kamu mengikuti sesuatu yang tidak kamu ketahui. Sesungguhnya pendengaran, penglihatan, dan hati nurani, semua itu akan diminta pertanggungjawabannya.'
      },
      reflectionPrompt: 'Mengapa dalam penelitian ilmiah dan penyusunan kebijakan ekologis, data time-series (urutan waktu tahun ke tahun) wajib diperiksa secara berkala? Bagaimana etika mengutip fakta keberhasilan restorasi lingkungan?',
      questions: [
        {
          id: 'p6_vi_1',
          question: 'Mengapa kita tidak boleh menyimpulkan kondisi sungai atau waduk hari ini hanya berdasarkan artikel berita yang terbit pada tahun 2017?',
          options: [
            'Karena intervensi restorasi lingkungan (seperti reboisasi, pengerukan sedimen, penegakan hukum) bisa mengubah indeks kualitas air secara signifikan dalam rentang waktu bertahun-tahun',
            'Karena semua artikel sebelum tahun 2020 otomatis terhapus dari server internet',
            'Karena undang-undang lingkungan hidup melarang membaca berita lama',
            'Karena alam tidak pernah berubah sama sekali sepanjang masa'
          ],
          correctIndex: 0,
          explanation: 'Lingkungan hidup adalah sistem yang dinamis. Proyek restorasi terpadu seperti Citarum Harum terbukti menurunkan status pencemaran berat menjadi cemar ringan dari waktu ke waktu.'
        },
        {
          id: 'p6_vi_2',
          question: 'Bagaimana keterkaitan prinsip Tabayyun (QS. Al-Hujurat: 6) dengan metode verifikasi literasi digital modern kurikulum merdeka?',
          options: [
            'Tabayyun hanya berlaku untuk masalah ibadah sholat dan tidak relevan untuk internet',
            'Tabayyun selaras dengan metodologi cek fakta modern: memeriksa rekam jejak jurnalisme, tanggal rilis, keaslian URL, dan konfirmasi silang ke lembaga resmi yang berwenang',
            'Tabayyun menganjurkan kita untuk mempercayai berita dari media sosial anonim',
            'Tabayyun mewajibkan menghapus semua aplikasi ponsel'
          ],
          correctIndex: 1,
          explanation: 'Islam telah meletakkan fondasi literasi kritis 14 abad silam melalui prinsip Tabayyun, yang mewajibkan kehati-hatian, penelusuran bukti otentik, dan konfirmasi sumber terpercaya.'
        }
      ],
      actionRecommendation: 'Buatlah proyek analisis komparatif "Dulu vs Sekarang" tentang penanganan salah satu masalah lingkungan di Jawa Tengah dengan menyertakan bukti rujukan kredibel.'
    }
  }
};

export const RADAR_HOTSPOTS: RadarHotspot[] = [
  {
    id: 'wonogiri',
    locationName: 'Wonogiri, Jawa Tengah',
    title: 'Penanganan Sedimentasi DAS Keduang & Konservasi Waduk Gajah Mungkur',
    publisher: 'Antara Jateng & Pemkab Wonogiri',
    publishDate: '24 Oktober 2024',
    realUrl: 'https://jateng.antaranews.com/berita/528345/konservasi-das-keduang-wonogiri',
    coordinates: { x: -8, z: 12 },
    summary: 'DAS Keduang di Kabupaten Wonogiri menjadi perhatian utama karena menyumbang endapan lumpur sedimentasi terbesar ke perairan Waduk Gajah Mungkur.',
    environmentalIssue: 'Tingginya laju erosi tanah di lereng hulu pegunungan DAS Keduang yang berpotensi memperpendek umur teknis waduk penyuplai irigasi Jawa Tengah dan Jawa Timur.',
    solutionAndFact: 'Program konservasi berkelanjutan melalui penanaman tanaman vetiver rumput akar wangi, reboisasi pohon berakar dalam (beringin, aren, bambu), serta pembuatan dam penahan sedimen (check dam) oleh BBWS Bengawan Solo bersama masyarakat Wonogiri.',
    historicalVsCurrent: 'Catatan Historis: Pada tahun-tahun sebelumnya, sedimentasi mengancam turbin PLTA. Kondisi Terkini: Upaya penghijauan hulu dan pengoperasian closure dike terbukti efektif menekan laju endapan lumpur.',
    tabayyunQuestion: 'Berdasarkan prinsip tabayyun, mengapa penanganan sedimentasi Waduk Gajah Mungkur membutuhkan penghijauan di hulu DAS Keduang, bukan hanya mengeruk lumpur di waduk?',
    tabayyunOptions: [
      'Pengerukan hanya mengatasi akibat di hilir, sedangkan penghijauan menghentikan akar masalah erosi di hulu secara permanen',
      'Karena mengeruk lumpur di waduk dapat membuat air waduk mendidih',
      'Agar petani di hulu bisa memelihara buaya di sungai',
      'Penghijauan hanya untuk keperluan kontes kecantikan desa'
    ],
    correctOptionIndex: 0,
    verified: false
  },
  {
    id: 'demak',
    locationName: 'Demak, Jawa Tengah',
    title: 'Restorasi Sabuk Mangrove Penahan Abrasi & Rob Pesisir Sayung',
    publisher: 'Kompas.com Sains & Lingkungan',
    publishDate: '15 Agustus 2024',
    realUrl: 'https://kompas.com/sains/read/2024/08/15/restorasi-mangrove-sayung-demak',
    coordinates: { x: -4, z: 8 },
    summary: 'Wilayah pesisir Sayung dan Morosari Demak menghadapi ancaman kenaikan permukaan laut dan abrasi gelombang pantai utara Jawa.',
    environmentalIssue: 'Hilangnya garis pantai dan tenggelamnya beberapa pemukiman akibat abrasi gelombang laut dan penurunan muka tanah (land subsidence).',
    solutionAndFact: 'Kolaborasi Kementerian Kelautan dan Perikanan bersama kelompok pegiat pesisir menanam jutaan bibit Rhizophora dan membangun struktur bambu pemecah gelombang (APBO) ramah lingkungan.',
    historicalVsCurrent: 'Catatan Historis: Laju abrasi sempat mengikis daratan hingga puluhan hektar. Kondisi Terkini: Rumpun mangrove yang membesar berhasil menjebak endapan lumpur dan mengembalikan daratan baru.',
    tabayyunQuestion: 'Mengapa penggunaan pemecah ombak bambu dan penanaman mangrove lebih ramah lingkungan daripada menembok beton mati di pesisir Sayung?',
    tabayyunOptions: [
      'Karena akar mangrove menjadi habitat alami pembibitan ikan dan kepiting serta mampu tumbuh mengikuti kenaikan muka air laut',
      'Karena pohon mangrove tidak membutuhkan air untuk hidup',
      'Karena bambu dapat memantulkan sinar matahari ke luar angkasa',
      'Agar ombak laut berhenti selamanya'
    ],
    correctOptionIndex: 0,
    verified: false
  },
  {
    id: 'bandung',
    locationName: 'Bandung / Jawa Barat',
    title: 'Transformasi Sungai Citarum Harum: Dari Tercemar Berat Menuju Harum',
    publisher: 'Tempo.co Lingkungan',
    publishDate: '12 September 2024',
    realUrl: 'https://tempo.co/read/citarum-harum-kualitas-air-membaik',
    coordinates: { x: -14, z: 6 },
    summary: 'Program Terpadu Citarum Harum (Perpres No. 15 Tahun 2018) mengerahkan Satgas gabungan TNI, DLH, akademisi, dan warga untuk memulihkan sungai terpanjang di Jawa Barat.',
    environmentalIssue: 'Pencemaran limbah cair pabrik tekstil ilegal tanpa IPAL dan buangan sampah domestik puluhan ribu ton per hari.',
    solutionAndFact: 'Penegakan hukum saluran siluman limbah pabrik, pembangunan insinerator ramah lingkungan dan TPS 3R di ratusan desa bantaran sungai, serta rehabilitasi mata air Situ Cisanti.',
    historicalVsCurrent: 'Catatan Historis: Sungai Citarum pernah dijuluki salah satu sungai terkotor di dunia pada 2010. Kondisi Terkini: Status mutu air telah membaik secara signifikan menjadi cemar ringan hingga sedang.',
    tabayyunQuestion: 'Jika seseorang mengunggah video Sungai Citarum yang penuh lautan sampah tanpa menyebutkan bahwa video itu direkam tahun 2014, sikap tabayyun kita adalah:',
    tabayyunOptions: [
      'Langsung menyebarkan video itu dengan narasi menuduh pemerintah gagal',
      'Mencari data pembanding terkini tahun 2024 dan menjelaskan bahwa video tersebut adalah dokumentasi lama sebelum program restorasi Citarum Harum',
      'Mempercayai bahwa sungai tersebut tidak akan pernah bisa bersih',
      'Memblokir semua berita tentang lingkungan di media'
    ],
    correctOptionIndex: 1,
    verified: false
  },
  {
    id: 'balikpapan',
    locationName: 'Balikpapan & Penajam, Kalimantan Timur',
    title: 'Koridor Hijau Nusantara: Konservasi Hutan Lindung Sungai Wain & IKN',
    publisher: 'Antara News Nasional',
    publishDate: '05 Juli 2024',
    realUrl: 'https://antaranews.com/berita/4183021/koridor-satwa-hutan-lindung-sungai-wain',
    coordinates: { x: 8, z: -2 },
    summary: 'Pembangunan Ibu Kota Nusantara mengadopsi konsep Forest City (Kota Hutan Rimba), menjaga keutuhan Hutan Lindung Sungai Wain (HLSW) seluas 10.000 hektar.',
    environmentalIssue: 'Ancaman fragmentasi habitat satwa endemik seperti Orangutan, Bekantan, dan Beruang Madu akibat aktivitas pembukaan lahan.',
    solutionAndFact: 'Pembangunan jembatan dan terowongan lintas satwa (wildlife overpass/underpass), penanaman kembali tanaman pakan satwa di lahan bekas tambang, dan patroli bersama Polhut.',
    historicalVsCurrent: 'Catatan Historis: Hutan perbatasan rentan terhadap perambahan liar dan kebakaran saat El Nino. Kondisi Terkini: Penetapan batas penyangga ketat 75% tutupan hijau kota rimba.',
    tabayyunQuestion: 'Bagaimana peran koridor satwa (jembatan hutan buatan) dalam menjaga keanekaragaman genetik satwa liar?',
    tabayyunOptions: [
      'Memungkinkan satwa menyeberang antar fragmen hutan tanpa tertabrak kendaraan dan mencegah perkawinan sedarah',
      'Agar satwa bisa menonton kendaraan di jalan tol',
      'Sebagai tempat wisata swafoto anak-anak sekolah',
      'Untuk menggiring satwa agar keluar dari Kalimantan'
    ],
    correctOptionIndex: 0,
    verified: false
  },
  {
    id: 'palu',
    locationName: 'Palu, Sulawesi Tengah',
    title: 'Sabuk Hijau Teluk Palu: Mitigasi Tsunami Berbasis Alam (Eco-DRR)',
    publisher: 'Badan Nasional Penanggulangan Bencana (BNPB)',
    publishDate: '28 September 2024',
    realUrl: 'https://bnpb.go.id/berita/sabuk-hijau-mitigasi-tsunami-teluk-palu',
    coordinates: { x: 18, z: 2 },
    summary: 'Pascabencana gempa dan tsunami 2018 di Teluk Palu, pemerintah dan warga membangun sabuk hijau pesisir sebagai benteng alami peredam energi gelombang.',
    environmentalIssue: 'Kerentanan garis pantai terhadap hempasan gelombang laut dan gempa sesar Palu-Koro.',
    solutionAndFact: 'Penanaman pohon ketapang laut, cemara udang, dan mangrove di zona sempadan pantai yang terlarang untuk bangunan tempat tinggal.',
    historicalVsCurrent: 'Catatan Historis: Pesisir terbuka tanpa vegetasi pelindung mengalami kerusakan parah pada 2018. Kondisi Terkini: Garis sempadan telah ditetapkan sebagai ruang terbuka hijau (RTH) sabuk pengaman.',
    tabayyunQuestion: 'Dalam perspektif mitigasi bencana Islam, menanam sabuk hijau pohon cemara udang di bibir pantai adalah wujud:',
    tabayyunOptions: [
      'Ikhtiar nyata akal sehat manusia dalam menaati hukum alam (sunnatullah) untuk melindungi keselamatan jiwa',
      'Sikap menentang takdir yang sudah ditentukan',
      'Pemborosan bibit tanaman yang tidak berguna',
      'Upaya menghalangi kapal nelayan untuk bersandar'
    ],
    correctOptionIndex: 0,
    verified: false
  },
  {
    id: 'sentani',
    locationName: 'Sentani, Jayapura, Papua',
    title: 'Penyelamatan Cagar Alam Pegunungan Cycloop & Danau Sentani',
    publisher: 'Antara Papua & Kementerian LHK',
    publishDate: '19 November 2024',
    realUrl: 'https://papua.antaranews.com/berita/719284/rehabilitasi-pegunungan-cycloop-jayapura',
    coordinates: { x: 30, z: 6 },
    summary: 'Kawasan Cagar Alam Pegunungan Cycloop (Dafonsoro) merupakan penyangga hidup, sumber mata air utama, dan perisai pencegah banjir bandang di kawasan Danau Sentani.',
    environmentalIssue: 'Perambahan lereng curam untuk perladangan dan pemukiman yang berpotensi memicu longsor dan banjir bandang jika curah hujan ekstrem.',
    solutionAndFact: 'Gerakan adat penanaman pohon bambu di zona patahan, pemulihan mata air, dan penetapan hutan adat lindung bersama Ondoafi (pemimpin adat Papua).',
    historicalVsCurrent: 'Catatan Historis: Banjir bandang dahsyat pernah melanda Sentani pada Maret 2019. Kondisi Terkini: Daerah tangkapan air hulu telah direhabilitasi dengan ribuan pohon endemik.',
    tabayyunQuestion: 'Mengapa kearifan lokal masyarakat adat (seperti larangan menebang hutan sakral Cycloop) sejalan dengan nilai-nilai PAI tentang menjaga alam?',
    tabayyunOptions: [
      'Karena keduanya sama-sama melarang perusakan bumi (Fasad fil Ardh) dan menekankan penghormatan terhadap keseimbangan ciptaan Tuhan',
      'Karena hukum adat hanya berlaku untuk orang yang tidak bersekolah',
      'Agar masyarakat tidak boleh minum air dari pegunungan',
      'Karena pohon bambu dapat berbicara dalam bahasa daerah'
    ],
    correctOptionIndex: 0,
    verified: false
  }
];

export const POST_TEST_QUESTIONS: Record<GradeLevel, PedagogicalQuestion[]> = {
  '5': [
    {
      id: 'pt_5_1',
      question: 'Manusia diciptakan oleh Allah SWT di muka bumi memegang mandat agung sebagai "Khalifah fil Ardh". Makna yang paling tepat adalah...',
      options: [
        'Penguasa yang bebas menebangi pohon dan mengeksploitasi hewan sesuka hati',
        'Pemimpin dan pemakmur bumi yang amanah dalam merawat kelestarian lingkungan ciptaan Allah',
        'Penghuni bumi yang tidak memiliki kewajiban menjaga alam',
        'Makhluk yang hanya bertugas beribadah ritual tanpa mempedulikan kebersihan'
      ],
      correctIndex: 1,
      explanation: 'QS. Al-Baqarah: 30 menegaskan manusia sebagai khalifah, yaitu wakil pengelola bumi yang berkewajiban merawat dan memakmurkannya.'
    },
    {
      id: 'pt_5_2',
      question: 'Ketika kamu menemukan keran air tempat wudhu di sekolah mengalir meluap, tindakan terpuji yang mencerminkan akhlak khalifah adalah...',
      options: [
        'Membiarkannya karena bukan kita yang menyalakannya',
        'Segera menutup kran dengan rapat agar air tidak terbuang sia-sia',
        'Menggunakannya untuk bermain basah-basahan bersama teman',
        'Menunggu penjaga sekolah datang membersihkan'
      ],
      correctIndex: 1,
      explanation: 'Menutup keran air mencegah pemborosan (tabdzir). Rasulullah SAW melarang berlebih-lebihan dalam berwudhu meskipun di tepi sungai mengalir.'
    },
    {
      id: 'pt_5_3',
      question: 'Sampah di halaman rumah harus dipilah secara benar. Daun-daun kering dan sisa kulit buah pisang tergolong ke dalam sampah...',
      options: [
        'Organik, karena berasal dari makhluk hidup dan dapat diolah menjadi kompos',
        'Anorganik, karena tidak bisa membusuk sama sekali',
        'B3 Berbahaya, karena mengandung racun timbal',
        'Elektronik, karena dapat menghasilkan listrik'
      ],
      correctIndex: 0,
      explanation: 'Sampah organik berasal dari sisa makhluk hidup (tumbuhan/hewan) yang dapat didekomposisi oleh mikroorganisme menjadi kompos penyubur tanah.'
    },
    {
      id: 'pt_5_4',
      question: 'Baterai mainan bekas dan wadah racun nyamuk kosong tidak boleh dipegang sembarangan atau dibakar, melainkan harus dipisah ke wadah B3 karena...',
      options: [
        'Baterai bekas sangat mahal harganya',
        'Mengandung zat kimia berbahaya beracun yang dapat mencemari tanah dan membahayakan kesehatan',
        'Dapat berubah menjadi es batu jika terkena api',
        'Hanya agar tempat sampah terlihat warna-warni'
      ],
      correctIndex: 1,
      explanation: 'Limbah B3 (Bahan Berbahaya dan Beracun) memerlukan penanganan khusus agar racun kimianya tidak meresap ke dalam rantai makanan atau air tanah.'
    },
    {
      id: 'pt_5_5',
      question: 'Prinsip 3R terdiri dari Reduce, Reuse, dan Recycle. Contoh nyata penerapan "REDUCE" dalam kehidupan sehari-hari anak sekolah adalah...',
      options: [
        'Membeli minuman kemasan plastik sekali pakai sebanyak 5 botol sehari',
        'Membawa botol minum (tumbler) sendiri dari rumah untuk mengurangi timbulan sampah plastik',
        'Membakar semua kertas ujian yang sudah selesai',
        'Membuang tempat makan plastik yang baru sekali dipakai'
      ],
      correctIndex: 1,
      explanation: 'Reduce berarti mengurangi penggunaan bahan sekali pakai sejak dari awal.'
    },
    {
      id: 'pt_5_6',
      question: 'Dalam QS. Ar-Rahman ayat 7-9, Allah SWT memerintahkan manusia untuk tidak melampaui batas dalam "Al-Mizan". Maksud dari Al-Mizan di alam semesta adalah...',
      options: [
        'Keseimbangan dan keserasian ekosistem ciptaan Allah yang tidak boleh dirusak',
        'Timbangan berat badan di ruang UKS',
        'Jam dinding di dalam masjid',
        'Jarak tempuh antara rumah ke sekolah'
      ],
      correctIndex: 0,
      explanation: 'Al-Mizan adalah hukum keteraturan dan keseimbangan alam yang diciptakan Allah dengan perhitungan yang maha teliti.'
    },
    {
      id: 'pt_5_7',
      question: 'Saat menjelajahi hutan dan menemukan sisa bara api unggun yang masih berasap, tindakan bijak yang aman bagi anak sekolah adalah...',
      options: [
        'Meniup bara api itu agar apinya semakin membesar',
        'Menyiramkan air/pasir dari jarak aman atau segera melaporkan ke pos petugas jagawana',
        'Meninggalkannya begitu saja karena hutan pasti bisa memadamkannya sendiri',
        'Melemparkan dedaunan kering ke atas bara tersebut'
      ],
      correctIndex: 1,
      explanation: 'Memadamkan api dari jarak aman atau melapor ke petugas jagawana mencegah terjadinya kebakaran hutan yang meluas.'
    },
    {
      id: 'pt_5_8',
      question: 'Waduk Gajah Mungkur di Kabupaten Wonogiri memiliki peran vital bagi masyarakat. Upaya yang tepat untuk menjaga kelestarian waduk dari hulu adalah...',
      options: [
        'Menebangi pohon-pohon di perbukitan DAS Keduang',
        'Melakukan reboisasi dan menanam tanaman pengikat tanah di sepanjang DAS Keduang',
        'Membuang sampah rumah tangga ke dalam aliran anak sungai',
        'Menutup pintu air waduk selamanya'
      ],
      correctIndex: 1,
      explanation: 'Reboisasi di DAS Keduang Wonogiri menahan erosi tanah sehingga lumpur tidak mendangkalkan perairan Waduk Gajah Mungkur.'
    },
    {
      id: 'pt_5_9',
      question: 'Ketika menerima sebuah pesan berita di media sosial yang menyatakan air sumur warga beracun, ajaran Al-Qur\'an dalam QS. Al-Hujurat ayat 6 menuntun kita untuk...',
      options: [
        'Langsung panik dan menyebarkan pesan tersebut ke semua teman',
        'Bertabayyun: meneliti kebenaran berita kepada sumber resmi pemerintah dan orang tua/guru',
        'Membuat cerita tambahan agar orang lain semakin takut',
        'Membuang semua air di rumah ke selokan'
      ],
      correctIndex: 1,
      explanation: 'Tabayyun adalah prinsip syariat untuk menguji validitas kebenaran kabar berita sebelum mengambil tindakan atau menyebarkannya.'
    },
    {
      id: 'pt_5_10',
      question: 'Hadits Nabi Muhammad SAW menyatakan bahwa setiap muslim yang menanam pohon lalu buah atau daunnya dimakan oleh burung atau manusia, maka bernilai...',
      options: [
        'Kerugian besar karena tanaman dimakan makhluk lain',
        'Sedekah jariyah yang mendatangkan pahala kebaikan dari Allah SWT',
        'Pekerjaan sia-sia tanpa faedah',
        'Hutang yang harus dibayar oleh burung'
      ],
      correctIndex: 1,
      explanation: 'Menanam pohon bernilai sedekah jariyah karena oksigen, buah, dan keteduhannya dinikmati oleh berbagai makhluk ciptaan Allah.'
    }
  ],
  '6': [
    {
      id: 'pt_6_1',
      question: 'Dalam kajian ekologi PAI Fase C, alam tersusun dari komponen biotik dan abiotik. Manakah kombinasi yang menunjukkan interaksi pelestarian timbal balik yang tepat?',
      options: [
        'Penebangan hutan tropis (biotik) menyebabkan peningkatan humus tanah (abiotik)',
        'Perakaran pohon mangrove (biotik) menahan erosi gelombang air laut dan menjebak endapan lumpur tanah (abiotik)',
        'Pembuangan deterjen ke sungai (abiotik) menyuburkan populasi ikan air tawar (biotik)',
        'Pembakaran plastik terbuka (abiotik) meningkatkan kemurnian udara fotosintesis (biotik)'
      ],
      correctIndex: 1,
      explanation: 'Pohon mangrove adalah komponen biotik yang menjaga integritas komponen abiotik (tanah pesisir dan garis pantai) dari hempasan gelombang.'
    },
    {
      id: 'pt_6_2',
      question: 'Firman Allah SWT dalam QS. Ar-Rum ayat 41 "Zhoharol fasadu fil barri wal bahri bima kasabat aidinnas" menegaskan bahwa bencana kerusakan ekologis berakar dari...',
      options: [
        'Kelemahan alam semesta yang memang dirancang untuk mudah hancur',
        'Perbuatan kelalaian, keserakahan, dan eksploitasi yang dilakukan oleh tangan manusia',
        'Ketidakseimbangan pergerakan benda-benda langit di luar angkasa',
        'Populasi satwa liar yang berkembang terlalu banyak di alam'
      ],
      correctIndex: 1,
      explanation: 'Al-Qur\'an secara eksplisit mengidentifikasi bahwa krisis ekologi (kerusakan di darat dan laut) adalah akibat langsung dari perbuatan tangan manusia yang tidak amanah.'
    },
    {
      id: 'pt_6_3',
      question: 'Pencemaran mikroplastik pada sungai dan danau membahayakan rantai makanan karena plastik bersifat persistent. Secara biologi tanah dan fiqih lingkungan, plastik...',
      options: [
        'Dapat terurai sempurna oleh bakteri tanah dalam waktu 2 hari',
        'Tidak dapat didekomposisi biologis secara cepat dan melepaskan toksin karsinogenik yang meracuni komponen biotik perairan',
        'Merupakan pupuk organik terbaik untuk tanaman padi',
        'Menghasilkan oksigen murni ketika terkena air hujan asam'
      ],
      correctIndex: 1,
      explanation: 'Rantai polimer sintetik plastik tidak dikenali oleh enzim pengurai alami, sehingga bertahan ratusan tahun dan terfragmentasi menjadi mikroplastik beracun.'
    },
    {
      id: 'pt_6_4',
      question: 'Pada kawasan pegunungan karst seperti di Jawa Tengah bagian selatan (termasuk Wonogiri), membuang sampah ke dalam "luweng" sangat dilarang keras karena...',
      options: [
        'Luweng memiliki sistem akuifer hidrologi conduit terbuka yang langsung menyalurkan polutan ke sungai bawah tanah sumber air minum warga tanpa filtrasi',
        'Luweng adalah tempat tinggal burung elang Jawa yang dilindungi',
        'Batu gamping di luweng dapat meleleh menjadi minyak bumi jika terkena plastik',
        'Sampah akan membuat gua berubah menjadi danau air panas mendidih'
      ],
      correctIndex: 0,
      explanation: 'Karakteristik hidrogeologi karst memiliki porositas rekahan tinggi tanpa lapisan tanah penyaring tebal, sehingga limbah di luweng langsung mencemari air minum akuifer hilir.'
    },
    {
      id: 'pt_6_5',
      question: 'Konsep "Circular Economy" dalam pengelolaan sampah modern selaras dengan maqashid syariah (tujuan hukum Islam) dalam hal...',
      options: [
        'Mempercepat pembuangan sampah ke Tempat Pemrosesan Akhir (TPA)',
        'Mencegah kerusakan (Daf\'u al-mafasid) dengan memaksimalkan siklus hidup material dan meminimalkan timbulan limbah (Zero Waste)',
        'Memusnahkan semua pabrik daur ulang untuk menghemat bahan bakar',
        'Mendorong masyarakat membeli barang baru setiap bulan'
      ],
      correctIndex: 1,
      explanation: 'Ekonomi sirkular menerapkan prinsip syariat pencegahan kemudaratan (Daf\'u al-mafasid muqaddam \'ala jalbi al-mashalih) dengan menjaga sumber daya tetap berputar tanpa mencemari bumi.'
    },
    {
      id: 'pt_6_6',
      question: 'Mengapa kardus atau kertas bekas yang telah basah terkena minyak pelumas atau sisa kuah makanan tidak dapat diproses dalam mesin daur ulang bubur kertas (pulp)?',
      options: [
        'Minyak bersifat hidrofobik yang merusak kemampuan ikatan serat selulosa saat dilarutkan dalam air, sehingga menghasilkan kertas berkualitas sangat rapuh/cacat',
        'Karena kertas berminyak otomatis menjadi batu bara padat',
        'Karena mesin daur ulang hanya boleh diisi oleh bahan kaca murni',
        'Karena tinta pada kardus akan berubah menjadi emas murni'
      ],
      correctIndex: 0,
      explanation: 'Molekul minyak tidak larut air dan menempel pada serat selulosa, menghambat proses penyatuan serat kembali (cross-linking) dalam bubur kertas daur ulang.'
    },
    {
      id: 'pt_6_7',
      question: 'Pembangunan infrastruktur di kawasan hijau (seperti konsep Forest City IKN di Kalimantan) mewajibkan pembuatan "Wildlife Overpass" (koridor satwa). Fungsinya adalah...',
      options: [
        'Tempat beristirahat pengendara mobil di jalan tol',
        'Mencegah fragmentasi habitat satwa liar dan menjaga keberlanjutan keanekaragaman genetik satwa tanpa bahaya tertabrak kendaraan',
        'Sebagai dekorasi arsitektur kota modern tanpa fungsi ekologis',
        'Jembatan khusus untuk memindahkan satwa ke luar pulau'
      ],
      correctIndex: 1,
      explanation: 'Koridor satwa mengatasi fragmentasi lanskap sehingga populasi fauna terisolasi dapat tetap bermigrasi mencari makan dan pasangan secara aman.'
    },
    {
      id: 'pt_6_8',
      question: 'Dalam menganalisis program restorasi Sungai Citarum Harum, seorang peneliti lingkungan menemukan artikel tahun 2013 yang menyebut Citarum sebagai "sungai terburuk di dunia". Berdasarkan literasi digital Tabayyun, kesimpulan yang objektif adalah...',
      options: [
        'Menyimpulkan bahwa Citarum hari ini masih sama kotornya karena kondisi alam tidak bisa diperbaiki',
        'Melakukan komparasi data time-series tahun 2013 dengan data mutakhir tahun 2024 yang menunjukkan perbaikan status mutu air berkat intervensi Satgas Citarum Harum',
        'Menghapus semua berita tentang Sungai Citarum dari mesin pencari',
        'Menolak membaca artikel ilmiah dan hanya percaya gosip media sosial'
      ],
      correctIndex: 1,
      explanation: 'Tabayyun ilmiah menuntut verifikasi waktu (temporal check) dan validasi data terkini, tidak menggeneralisasi kondisi masa lalu terhadap kemajuan hasil restorasi saat ini.'
    },
    {
      id: 'pt_6_9',
      question: 'Pesisir Sayung Demak menghadapi ancaman tenggelam akibat kombinasi dua faktor abiotik, yaitu...',
      options: [
        'Abrasi energi gelombang laut utara dan penurunan muka tanah (land subsidence) akibat pengambilan air tanah berlebih',
        'Hujan salju lebat dan ledakan gunung berapi bawah laut',
        'Penumpukan garam dapur dan angin topan gurun pasir',
        'Penyusutan volume air samudera akibat penguapan'
      ],
      correctIndex: 0,
      explanation: 'Penurunan muka tanah (land subsidence) akibat ekstraksi air tanah industri dan abrasi pasang laut adalah penyebab utama rob di pesisir Demak-Semarang.'
    },
    {
      id: 'pt_6_10',
      question: 'Al-Qur\'an Surah Al-Isra ayat 36 menyatakan: "Dan janganlah kamu mengikuti apa yang kamu tidak mempunyai pengetahuan tentangnya. Sesungguhnya pendengaran, penglihatan, dan hati nurani, semua itu akan diminta pertanggungjawabannya." Nilai integritas yang harus ditunjukkan seorang muslim saat menerima berita lingkungan di internet adalah...',
      options: [
        'Menyebarkan kabar hoax bencana tanpa memeriksa kredibilitas penerbit dan tanggal rilisnya',
        'Memverifikasi keaslian sumber, memeriksa tanggal terbit, mencocokkan dengan data instansi resmi, dan menggunakan nalar kritis yang beradab',
        'Membuat berita palsu tentang kebakaran hutan demi mendapatkan pengikut di media sosial',
        'Mengabaikan semua fakta ilmiah demi kepentingan keuntungan pribadi'
      ],
      correctIndex: 1,
      explanation: 'Ayat ini adalah pilar etika literasi dan integritas intelektual muslim: setiap informasi wajib diuji menggunakan indera dan akal budi sebelum disimpulkan atau disebarkan.'
    }
  ]
};

export const REAL_ACTION_PROJECT_TEMPLATES = {
  '5': {
    title: 'KARTU JANJI KHALIFAH CILIK BUMI NUSANTARA',
    subtitle: 'Proyek Aksi Nyata Mandiri — Kurikulum Merdeka PAI Kelas V',
    commitments: [
      { id: 'c1', text: 'Saya berjanji selalu membuang sampah pada tempatnya dan memisahkan sampah botol plastik dari sampah daun di rumah dan sekolah.' },
      { id: 'c2', text: 'Saya berjanji mematikan keran wudhu jika melihat air meluap dan tidak berlebih-lebihan saat menggunakan air bersih.' },
      { id: 'c3', text: 'Saya berjanji mematikan lampu dan kipas angin kelas ketika selesai jam pelajaran atau saat ruangan terang oleh sinar matahari.' },
      { id: 'c4', text: 'Saya berjanji membawa botol minum (tumbler) sendiri dari rumah untuk mengurangi sampah plastik sekali pakai.' },
      { id: 'c5', text: 'Saya berjanji merawat tanaman di rumah atau sekolah dengan menyiramnya secara teratur dan tidak merusak ranting pepohonan.' }
    ],
    reflectionHeader: 'Refleksi Hati Nurani:',
    reflectionQuestions: [
      'Apa aksi pelestarian lingkungan yang paling membahagiakan yang telah kamu lakukan minggu ini?',
      'Mengapa merawat bumi adalah bukti cinta kita kepada Allah Sang Maha Pencipta?'
    ]
  },
  '6': {
    title: 'RENCANA AKSI EKOLOGIS & DESAIN KAMPANYE TABAYYUN LINGKUNGAN',
    subtitle: 'Proyek Aksi Nyata Kolaboratif — Kurikulum Merdeka PAI Kelas VI',
    sections: [
      {
        id: 's1',
        name: 'Analisis Masalah Biotik & Abiotik Sekolah',
        guide: 'Identifikasi 1 masalah lingkungan nyata di lingkungan SDN 2 Girimarto (misal: timbulan sampah sachet kantin, pemborosan air wastafel, atau area tanah gundul).'
      },
      {
        id: 's2',
        name: 'Solusi Terpadu 3R (Reduce, Reuse, Recycle)',
        guide: 'Rancang langkah konkrit pencegahan (Reduce), pemanfaatan kembali (Reuse), atau pembuatan kompos/kerajinan dari limbah tersebut.'
      },
      {
        id: 's3',
        name: 'Kampanye Tabayyun & Literasi Lingkungan',
        guide: 'Buat slogan poster edukasi dan periksa sumber informasi pendukung agar tidak menyebarkan data usang atau kabar bohong tentang kondisi lingkungan setempat.'
      }
    ],
    sloganIdeas: [
      '"Jadilah Khalifah Berakal: Kurangi Plastik, Suburkan Bumi!"',
      '"Tabayyun Dulu Baru Sebar: Cerdas Berita, Selamatkan Nusantara!"',
      '"Air Wudhu Bukan untuk Dihambur: Rawat Sumber Mata Air Kehidupan!"',
      '"Dari Girimarto Wonogiri untuk Bumi Indonesia yang Lestari!"'
    ]
  }
};
