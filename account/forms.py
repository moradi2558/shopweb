from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError
from django import forms
from .models  import User

# forms ... 
class UserCreationForm(UserCreationForm):
    password1 = forms.CharField(label='password',widget=forms.PasswordInput)
    password2 = forms.CharField(label='passwordconfirm',widget=forms.PasswordInput)
    
    class Meta:
        model = User
        fields = ('username','email')
        
        def clean_email(self):
            email = self.cleaned_data['email']
            if User.objects.filter(email=email).exists():
                raise forms.ValidationError('این ایمیل از قبل وجود دارد')
            return email
        
        def clean_password2(self):
            cd = cleaned_data
            if len(cd['password1']) > 8:
                raise ValidationError('پسوورد شما باید کمتر از 8 رقم باشد')
            if cd['password1'] and cd['password2'] != cd['password2'] :
                raise ValidationError('پسوورد ها شبیه هم نیستند ')
            return cd['password2']
        
        def save(self,commit=True):
            user = super().save(commit=False)
            user.set_password(self.cleaned_data['password1'])
            if commit :
                user.save()
            return user
class UserChangeForm(UserChangeForm):
    password = ReadOnlyPasswordHashField(help_text="you can change the password with this <a href=\"../password/\"> link </a>")
    
    class Meta:
        model = User
        fields = ('username','email','password','last_login')
        