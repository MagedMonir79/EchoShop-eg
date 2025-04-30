#!/bin/bash

# بناء التطبيق
echo "🏗️ جاري بناء التطبيق..."
npm run build

# نشر التطبيق على Firebase
echo "🚀 جاري النشر على Firebase..."
firebase deploy --only hosting

echo "✅ تم النشر بنجاح! يمكنك زيارة التطبيق على: https://echoshop-eg.web.app"