---
title: "06. Animasi & Gestures Lengkap"
description: Panduan sistem animasi Jetpack Compose, animate*AsState, AnimatedVisibility, AnimatedContent, efek Shimmer Loading skeleton, dan deteksi gestures sentuhan.
---

# 📱 Jetpack Compose - Modul 06: Animasi & Gestures Lengkap

Di era XML lama, membuat animasi UI mengharuskan kita mendefinisikan file XML interpolator di folder `res/anim` dan memanipulasi `ValueAnimator`. Di Jetpack Compose, animasi diperlakukan sebagai **state yang berubah secara mulus seiring waktu**.

---

## 1. Animasi Properti Sederhana: `animate*AsState`

Cukup ganti nilai statis menjadi fungsi `animate*AsState` (seperti `animateDpAsState`, `animateColorAsState`, `animateFloatAsState`), dan Compose akan otomatis menganimasikan perubahannya dengan kurva fisika yang halus!

```kotlin
@Composable
fun TombolAnimasiUkuran() {
    var diperbesar by remember { mutableStateOf(false) }

    // Otomatis menganimasikan transisi dari 100.dp ke 200.dp:
    val lebarTombol by animateDpAsState(
        targetValue = if (diperbesar) 200.dp else 100.dp,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy, // Efek membal elastis!
            stiffness = Spring.StiffnessLow
        ),
        label = "AnimasiLebarTombol"
    )

    val warnaTombol by animateColorAsState(
        targetValue = if (diperbesar) Color(0xFF4CAF50) else Color(0xFF2196F3),
        label = "AnimasiWarna"
    )

    Button(
        onClick = { diperbesar = !diperbesar },
        modifier = Modifier.width(lebarTombol),
        colors = ButtonDefaults.buttonColors(containerColor = warnaTombol)
    ) {
        Text("Klik Saya")
    }
}
```

---

## 2. Muncul & Hilang: `AnimatedVisibility`

Menggantikan `View.GONE` dan `View.VISIBLE` dengan animasi transisi masuk (*Enter*) dan keluar (*Exit*) yang dapat dikombinasikan:

```kotlin
@Composable
fun BannerDiskon(tampilkan: Boolean) {
    AnimatedVisibility(
        visible = tampilkan,
        // Kombinasi efek fade in + slide masuk dari atas:
        enter = fadeIn(animationSpec = tween(300)) + expandVertically(),
        // Kombinasi efek fade out + shrink keluar ke atas:
        exit = fadeOut(animationSpec = tween(300)) + shrinkVertically()
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFFFF9800))
                .padding(16.dp)
        ) {
            Text("🎉 Selamat! Anda mendapatkan kupon diskon Rp 50.000!")
        }
    }
}
```

---

## 3. Pergantian Konten: `AnimatedContent`

Sangat cocok untuk transisi antar status angka (seperti counter) atau pergantian konten tab:

```kotlin
@Composable
fun CounterDenganAnimasiGeser(counter: Int) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Text("Total Item: ")
        
        AnimatedContent(
            targetState = counter,
            transitionSpec = {
                if (targetState > initialState) {
                    // Jika angka bertambah, geser angka baru dari bawah ke atas:
                    (slideInVertically { height -> height } + fadeIn()) togetherWith
                            (slideOutVertically { height -> -height } + fadeOut())
                } else {
                    // Jika angka berkurang, geser dari atas ke bawah:
                    (slideInVertically { height -> -height } + fadeIn()) togetherWith
                            (slideOutVertically { height -> height } + fadeOut())
                }
            },
            label = "AnimasiCounter"
        ) { nilaiTarget ->
            Text(
                text = "$nilaiTarget",
                style = MaterialTheme.typography.headlineLarge,
                fontWeight = FontWeight.Bold
            )
        }
    }
}
```

---

## 4. Efek Skeleton Shimmer Loading (`rememberInfiniteTransition`)

Pola animasi modern yang menampilkan efek gradien berkilau (*Shimmer*) saat data sedang dimuat dari internet:

```kotlin
@Composable
fun Modifier.shimmerLoading(): Modifier = composed {
    val transition = rememberInfiniteTransition(label = "ShimmerLoop")
    val translateAnim by transition.animateFloat(
        initialValue = 0f,
        targetValue = 1000f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1200, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "ShimmerX"
    )

    val shimmerColors = listOf(
        Color.LightGray.copy(alpha = 0.6f),
        Color.LightGray.copy(alpha = 0.2f),
        Color.LightGray.copy(alpha = 0.6f)
    )

    val brush = Brush.linearGradient(
        colors = shimmerColors,
        start = Offset.Zero,
        end = Offset(x = translateAnim, y = translateAnim)
    )

    background(brush)
}

// Penggunaan di Kartu Skeleton:
@Composable
fun KartuSkeleton() {
    Row(modifier = Modifier.padding(16.dp)) {
        Box(modifier = Modifier.size(60.dp).clip(CircleShape).shimmerLoading())
        Spacer(modifier = Modifier.width(16.dp))
        Column {
            Box(modifier = Modifier.width(150.dp).height(20.dp).shimmerLoading())
            Spacer(modifier = Modifier.height(8.dp))
            Box(modifier = Modifier.width(80.dp).height(14.dp).shimmerLoading())
        }
    }
}
```

---

## 5. Deteksi Gestures Sentuhan Rendah (`pointerInput`)

Jika Anda butuh mendeteksi gesture ketukan ganda (*Double Tap*), tekan lama (*Long Press*), atau pergeseran jari (*Drag*):

```kotlin
Box(
    modifier = Modifier
        .size(200.dp)
        .background(Color.Cyan)
        .pointerInput(Unit) {
            detectTapGestures(
                onPress = { print("Jari menekan layar") },
                onDoubleTap = { print("Klik ganda terdeteksi (Love / Like)!") },
                onLongPress = { print("Tekan lama terdeteksi (Tampilkan Menu)") },
                onTap = { print("Klik biasa") }
            )
        }
)
```
