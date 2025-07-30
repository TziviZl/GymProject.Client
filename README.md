# 🏋️‍♂️ GymProject - מערכת ניהול חדר כושר

מערכת ניהול מקיפה לחדר כושר הכוללת ממשק משתמש מתקדם ב-React עם טיפול בשגיאות, אימות דו-שלבי ותמיכה מלאה בעברית.

## 📋 תיאור הפרויקט

מערכת ניהול חדר כושר המאפשרת:
- **למתעמלים**: רישום לשיעורים, צפייה בלוח זמנים אישי, עדכון פרופיל
- **למאמנים**: ניהול שיעורים, צפייה במתעמלים, ביטול שיעורים
- **למזכירות**: ניהול מלא של מתעמלים, מאמנים, שיעורים והודעות

## 🛠️ טכנולוגיות ושפות

### Frontend (React)
| טכנולוגיה | גרסה | תיאור |
|------------|------|--------|
| **React** | 19.1.0 | ספריית UI מתקדמת |
| **TypeScript** | 4.9.5 | שפת תכנות עם טיפוסים |
| **Redux Toolkit** | 2.8.2 | ניהול מצב גלובלי |
| **React Router** | 7.6.2 | ניתוב בין דפים |
| **Axios** | 1.9.0 | קריאות HTTP |
| **TanStack Query** | 5.83.0 | ניהול מצב שרת |
| **Framer Motion** | 12.23.9 | אנימציות |

### Backend (.NET)
- **ASP.NET Core** - שרת API
- **Entity Framework** - ORM למסד נתונים
- **SQL Server** - מסד נתונים
- **SMS Gateway** - שליחת קודי אימות

## 🚀 התקנה והרצה

### דרישות מוקדמות
```bash
# Node.js גרסה 16 ומעלה
node --version

# npm או yarn
npm --version
```

### שלבי התקנה

1. **שכפול הפרויקט**
```bash
git clone <repository-url>
cd GymProject.Client
```

2. **התקנת תלויות**
```bash
npm install
```

3. **הגדרת משתני סביבה**
```bash
# יצירת קובץ .env.local
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

4. **הרצת הפרויקט**
```bash
npm start
```

5. **פתיחת הדפדפן**
```
http://localhost:3000
```

## 👥 סוגי משתמשים ותפקידים

### 🤸‍♀️ מתעמל (Gymnast)
- **התחברות**: תעודת זהות + טלפון + קוד SMS
- **יכולות**:
  - רישום לשיעורים זמינים
  - צפייה בשיעורים אישיים
  - עדכון פרטים אישיים
  - יצירת קשר עם המזכירות
  - צפייה בבלוג ספורט

### 🏃‍♂️ מאמן (Trainer)
- **התחברות**: תעודת זהות + טלפון + קוד SMS
- **יכולות**:
  - צפייה בשיעורים שלו
  - ביטול שיעורים
  - צפייה במספר מתעמלים
  - עדכון פרופיל אישי
  - מחיקת פרופיל

### 👩‍💼 מזכירה (Secretary)
- **התחברות**: תעודת זהות + טלפון + קוד SMS
- **יכולות מלאות**:
  - ניהול מתעמלים (הוספה, עריכה, מחיקה)
  - ניהול מאמנים (הוספה, עריכה, מחיקה)
  - ניהול שיעורים (יצירה, עריכה, ביטול)
  - הוספה/הסרה של מתעמלים משיעורים
  - צפייה בהודעות קשר
  - דוחות ונתונים

## 🔐 מערכת אימות ואבטחה

### תהליך התחברות (End-to-End)
```
1. הזנת תעודת זהות + מספר טלפון
2. בדיקת קיום המשתמש במסד הנתונים
3. אימות התאמת הטלפון לתעודת הזהות
4. שליחת קוד אימות ב-SMS
5. הזנת קוד אימות
6. אימות הקוד מול השרת
7. קבלת סוג המשתמש (gymnast/trainer/secretary)
8. שמירת מצב התחברות ב-localStorage + Context
9. ניתוב אוטומטי לדף המתאים
```

### אבטחת נתונים
- **אין סיסמאות** - רק אימות דו-שלבי
- **קודי SMS זמניים** - פגים אחרי זמן מוגדר
- **הרשאות לפי תפקיד** - כל משתמש רואה רק את המותר לו
- **שמירה מקומית מוצפנת**

## ⚙️ תכונות מתקדמות

### 🛡️ Middleware לטיפול בשגיאות
```typescript
// Redux Error Middleware
export const errorMiddleware: Middleware = (store) => (next) => (action: any) => {
  if (action.type?.endsWith('/rejected')) {
    const errorMessage = action.payload?.message || 'שגיאה לא צפויה';
    store.dispatch(showToast({ message: errorMessage, type: 'error' }));
  }
  return next(action);
};

// Axios Response Interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'שגיאת רשת';
    if (error.response?.status === 400) {
      message = error.response.data || 'שגיאה בפעולה';
      if (message.includes('already registered')) {
        message = 'אתה כבר רשום לשיעור הזה';
      }
    }
    store.dispatch(showToast({ message, type: 'error' }));
    return Promise.reject(error);
  }
);
```

### 🎨 עיצוב ונגישות
- **תמיכה מלאה בעברית (RTL)**
- **עיצוב רספונסיבי** - מותאם לכל המכשירים
- **אנימציות חלקות** עם Framer Motion
- **Toast Messages** להודעות משתמש
- **Loading States** ו-Error Boundaries

### 📱 תכונות UX מתקדמות
- **Cache חכם** לשיעורים (2 דקות)
- **Batch Loading** לסטטוס שיעורים
- **Real-time Updates** למצב שיעורים
- **Confirmation Dialogs** לפעולות רגישות

## 📁 מבנה הפרויקט

```
src/
├── 📁 api/              # קריאות HTTP לשרת
│   ├── authApi.ts       # אימות והתחברות
│   ├── gymnastApi.ts    # פעולות מתעמלים
│   ├── trainerApi.ts    # פעולות מאמנים
│   └── classApi.ts      # פעולות שיעורים
├── 📁 components/       # רכיבי React
│   ├── shared/          # רכיבים משותפים
│   │   ├── Navbar.tsx   # תפריט ניווט
│   │   ├── Footer.tsx   # כותרת תחתונה
│   │   ├── ErrorBoundary.tsx # טיפול בשגיאות
│   │   └── ToastContainer.tsx # הודעות
│   └── tables/          # טבלאות נתונים
├── 📁 context/          # React Context
│   └── AuthContext.tsx  # ניהול מצב התחברות
├── 📁 middleware/       # Middlewares
│   ├── errorMiddleware.ts    # טיפול בשגיאות Redux
│   └── axiosInterceptor.ts   # טיפול בשגיאות HTTP
├── 📁 pages/            # דפי האפליקציה
│   ├── auth/            # דפי אימות
│   ├── user/            # דפי מתעמל
│   ├── trainer/         # דפי מאמן
│   └── admin/           # דפי מזכירה
├── 📁 store/            # Redux Store
│   ├── store.ts         # הגדרת Store
│   └── slices/          # Redux Slices
├── 📁 types/            # הגדרות TypeScript
├── 📁 utils/            # פונקציות עזר
└── 📁 css/              # קבצי עיצוב
```

## 🔄 תהליכים עסקיים מרכזיים

### 📝 רישום מתעמל לשיעור
```
1. מתעמל רואה רשימת שיעורים זמינים
2. לחיצה על "Join" לשיעור רצוי
3. בדיקות ולידציה:
   ✅ משתמש מחובר
   ✅ שיעור לא מבוטל
   ✅ שיעור לא מלא
   ✅ לא רשום כבר
   ✅ לא חרג ממגבלה שבועית
4. קריאה ל-API: addGymnastLesson
5. יצירת רישום במסד הנתונים
6. עדכון מספר נרשמים
7. הודעת הצלחה/שגיאה למשתמש
```

### 🗑️ הסרת מתעמל משיעור
```
1. מזכירה נכנסת לניהול שיעורים
2. בחירת שיעור וצפייה במתעמלים
3. לחיצה על "הסר" ליד מתעמל
4. חלון אישור
5. קריאה ל-API: removeGymnastFromClass
6. מחיקת הקשר במסד הנתונים
7. עדכון מספר נרשמים (-1)
8. הודעת הצלחה ורענון רשימה
```

## 🧪 בדיקות ופיתוח

### הרצת בדיקות
```bash
npm test
```

### בנייה לפרודקשן
```bash
npm run build
```

### הרצה עם דיבוג
```bash
npm start
# פתח Developer Tools (F12) לצפייה בלוגים
```

## 🌐 תמיכה בשפות

- **עברית**: שפה עיקרית (RTL)
- **אנגלית**: קוד ותיעוד
- **תמיכה עתידית**: ערבית, רוסית

## 📞 תמיכה ופתרון בעיות

### בעיות נפוצות

**שגיאות התחברות:**
```bash
# בדוק את הגדרות ה-API
echo $REACT_APP_API_BASE_URL

# בדוק חיבור לשרת
curl http://localhost:5000/api/health
```

**שגיאות טעינה:**
```bash
# נקה cache
npm start -- --reset-cache

# התקן מחדש
rm -rf node_modules package-lock.json
npm install
```

## 🔮 תכונות עתידיות

- [ ] אפליקציית מובייל (React Native)
- [ ] התראות Push
- [ ] תשלומים אונליין
- [ ] דוחות מתקדמים
- [ ] אינטגרציה עם לוח שנה
- [ ] צ'אט בזמן אמת

## 👨‍💻 מפתחים

פרויקט זה פותח כחלק ממערכת ניהול חדר כושר מקיפה.

---

