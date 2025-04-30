# تعليمات نشر موقع EchoShop على Firebase

هذه التعليمات سترشدك خلال عملية نشر موقع EchoShop على نطاق `echoshop-eg.web.app` باستخدام Firebase Hosting. أكمل هذه الخطوات على جهاز الكمبيوتر الخاص بك.

## المتطلبات المسبقة

1. تأكد من وجود حساب Google متصل بمشروع Firebase الخاص بك.
2. تأكد من أن لديك Node.js وnpm مثبتين على جهازك.

## خطوات النشر

### 1. تنزيل المشروع

قم أولاً بتنزيل كامل مشروع EchoShop من Replit إلى جهازك المحلي.

### 2. تثبيت Firebase CLI

افتح موجه الأوامر (Command Prompt أو Terminal) وقم بتنفيذ الأمر التالي:

```bash
npm install -g firebase-tools
```

### 3. تسجيل الدخول إلى Firebase

قم بتنفيذ الأمر التالي وسيتم فتح متصفح ليطلب منك تسجيل الدخول بحساب Google الخاص بك:

```bash
firebase login
```

### 4. التأكد من وجود مشروع Firebase

تأكد من أن ملفي `.firebaserc` و `firebase.json` موجودان في المجلد الرئيسي للمشروع، وأن `.firebaserc` يحتوي على معرف المشروع الصحيح:

محتوى `.firebaserc`:
```json
{
  "projects": {
    "default": "echoshop-eg"
  }
}
```

محتوى `firebase.json`:
```json
{
  "hosting": {
    "public": "dist/public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

### 5. بناء المشروع

قم بتنفيذ الأمر التالي لبناء المشروع:

```bash
npm run build
```

### 6. النشر على Firebase

بعد اكتمال عملية البناء، قم بتنفيذ الأمر التالي للنشر:

```bash
firebase deploy
```

أو للنشر على الاستضافة فقط:

```bash
firebase deploy --only hosting
```

### 7. الوصول إلى الموقع المنشور

بعد نجاح عملية النشر، ستظهر رسالة تفيد بأن النشر قد اكتمل بنجاح وستجد رابط الموقع:
`https://echoshop-eg.web.app`

## التحقق من قواعد الأمان

بعد النشر، تأكد من أن قواعد الأمان محددة بشكل صحيح للـ Firestore و Storage. يمكنك التحقق من هذا في لوحة تحكم Firebase:

1. انتقل إلى [لوحة تحكم Firebase](https://console.firebase.google.com)
2. اختر مشروع "echoshop-eg"
3. تحقق من التكوينات ضمن أقسام Firestore وStorage

## المزيد من المساعدة

إذا واجهت أي مشاكل، يرجى الرجوع إلى [وثائق Firebase](https://firebase.google.com/docs) أو [مجتمع الدعم](https://firebase.google.com/community).