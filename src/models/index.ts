import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const CategorySchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    color: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const TransactionSchema = new Schema({
    amount: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    date: { type: Date, required: true },
    note: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' }
});

const GoalSchema = new Schema({
    name: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    deadline: { type: Date },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const ContactSchema = new Schema({
    name: { type: String, required: true },
    initials: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const NotificationSchema = new Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['alert', 'reminder', 'system'], default: 'system' },
    isRead: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
export const Goal = mongoose.models.Goal || mongoose.model('Goal', GoalSchema);
export const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
export const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
