'use strict';

/* Services */

angular.module('expro-future2.services', ['lbServices'])

.factory('CurrentEmploye', function (Employe, $rootScope) {
  var _currentEmploye = undefined
  var _currentUser = undefined
  
  return {
    currentEmploye: function () {
      return _currentEmploye
    },
    
    setCurrentEmploye: function (user) {
      $rootScope.currentUser = user
      _currentUser = user
      if(user.employeID) {
        Employe.findOne({
          filter:{
            where:{id:user.employeID}, 
            include:['merchant', 'shop']
          }
        }, function (employe) {
          _currentEmploye = employe
          $rootScope.currentEmploye = employe
        }, function (res) {
          console.log('Find employe error')
        })
      }
    }
    
  }
})

.factory('DealTransaction', function (CurrentEmploye, Deal) {
  var _deal = undefined
  
  var registerItem = function (item) {
    var exited = _deal.items.some(function (dealItem) {
      if(item.id === dealItem.item.id) {
        dealItem.quantity += 1
        _deal.quantity += 1
        _deal.fee += dealItem.dealPrice 
        return true
      } else {
        return false
      }
    })
    if(exited) return
    _deal.items.push({
      item: {
        id: item.id,
        "name": item.name,
        price: item.price
      },
      dealPrice: item.price,
      quantity: 1
    })        
    _deal.quantity += 1
    _deal.fee += item.price 
  }
  
  var DT = {
    "open": function () {
      var now = Date.now()
      var employe = CurrentEmploye.currentEmploye()
      _deal = {
        merchantID: employe.merchant.id,
        shopID: employe.shopID,
        seller: {
          employeID: employe.id,
          jobNumber: employe.jobNumber,
          "name": employe.name
        },
        serialNumber: now,
        quantity: 0,
        fee: 0,
        items: [],
        bill: {
          amount: 0,
          billNumber: now,
          shopID: employe.shopID,
          merchantID: employe.merchantID,
          agentID: employe.id,
          dealType: 'deal',
          cashSettlement: {
            "status": 'closed',
            serialNumber: now,
            amount: 0,
            settledAt: now,
            payType: 'cash'
          }
        }
      }
      
      return _deal
    },
    
    setMember: function (member) {
      if(!member) {
        _deal.bill.memberSettlement = null
        _deal.buyer = null
      } else {
        var now = Date.now()

        _deal.buyer = {
          "name": member.name,
          code: member.code,
          memberID: member.id
        }
        
        _deal.bill.memberSettlement = {
          "status": 'closed',
          serialNumber: now,
          amount: 0,
          settledAt: now,
          payType: 'perpay',
          payerAccount: member.account
        }
      }
    },
    
    registerItem: registerItem,
    
    registerItems: function (items) {
      items.forEach(registerItem)
    },
    
    settle: function (successCb, errorCb) {
      
      var validateSettlement = function (settlement) {
        return settlement && settlement.amount > 0 ? settlement : null
      }
      
      _deal.bill.amount = _deal.fee
      _deal.bill.cashSettlement = validateSettlement(_deal.bill.cashSettlement)
      _deal.bill.memberSettlement = validateSettlement(_deal.bill.memberSettlement)

      var paidAmount = 0
      if(_deal.bill.cashSettlement) {
        paidAmount += _deal.bill.cashSettlement.amount
      }
      if(_deal.bill.memberSettlement) {
        paidAmount += _deal.bill.memberSettlement.amount
      }
      if(paidAmount < _deal.bill.amount - _deal.bill.discountAmount) {
        return errorCb(null, {type: 'danger', msg: '支付金额不足'})
      }
      
      
      Deal.create(_deal, successCb, function (res) {
        errorCb(res, {type: 'danger', msg: '创建失败'})
      })
    }
  }
  
  return DT
})