import mongoose from 'mongoose';
import { envConfig } from './env';

export const connectDB = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', true);

    await mongoose.connect(envConfig.MONGODB_URI, {
      autoIndex: envConfig.isDevelopment,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ MongoDB متصل بنجاح');

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB انقطع الاتصال — جاري إعادة الاتصال');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ خطأ في MongoDB:', err);
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB اتصل تاني بنجاح');
    });
  } catch (error) {
    console.error('❌ فشل الاتصال بـ MongoDB:', error);
    process.exit(1);
  }
};