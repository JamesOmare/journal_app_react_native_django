from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from .models import JournalEntry
from .serializers import JournalEntrySerializer
from django.shortcuts import get_object_or_404

class JournalEntryViewSet(viewsets.ModelViewSet):
    queryset = JournalEntry.objects.all()
    serializer_class = JournalEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='summary')
    def summary(self, request):
        user = request.user
        period = request.query_params.get('period', 'daily')

        if period == 'daily':
            summary = JournalEntry.objects.filter(user=user).extra({'day': "date(date)"}).values('day').annotate(count=Count('id'))
        elif period == 'weekly':
            summary = JournalEntry.objects.filter(user=user).extra({'year_week': "strftime('%Y-W%W', date)"}).values('year_week').annotate(count=Count('id'))
        elif period == 'monthly':
            summary = JournalEntry.objects.filter(user=user).extra({'year_month': "strftime('%Y-%m', date)"}).values('year_month').annotate(count=Count('id'))
        else:
            return Response({'error': 'Invalid period'}, status=400)

        return Response(summary)
    
    @action(detail=False, methods=['get'], url_path='by-date')
    def by_date(self, request):
        user = request.user
        selected_date = request.query_params.get('date')

        if not selected_date:
            return Response({'error': 'Date parameter is required'}, status=400)

        journals = JournalEntry.objects.filter(user=user, date=selected_date)
        serializer = self.get_serializer(journals, many=True)

        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='by-category')
    def by_category(self, request):
        user = request.user
        category = request.query_params.get('category')

        if not category:
            return Response({'error': 'Category parameter is required'}, status=400)
        
        if category == 'All':
            journals = JournalEntry.objects.filter(user=user)
            serializer = self.get_serializer(journals, many=True)
            return Response(serializer.data)

        journals = JournalEntry.objects.filter(user=user, category=category)
        serializer = self.get_serializer(journals, many=True)

        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()
        print('Incoming data:', request.data)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        print('Serializer data:', serializer.initial_data)
        if serializer.is_valid():
            serializer.save(user=user)
            print('Updated instance:', serializer.data)
            return Response(serializer.data)
        else:
            print('Serializer errors:', serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
